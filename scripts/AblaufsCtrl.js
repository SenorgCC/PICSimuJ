/**
 * Created by Alex on 02.05.2016.
 */
app.controller("AblaufsCtrl",function($scope,DataPic,$timeout){
    $scope.StopFlag=false;
    DataPic.Instructioncounter=0;
    var testsequenzeline;
    var temp1,temp2;
    $scope.breakpointbox=false;
    $scope.breakpointview=true;
    $scope.ProgramCounter=[];
    var runner;

    var firstrunFlag=true;


    $scope.runPic = function(){
        $scope.Startapp();
    };

    $scope.Startapp = function () {
        $scope.StopFlag=false;
        if(firstrunFlag==true){
            DataPic.Instructioncounter=0;
        }
        firstrunFlag=false;

        ///TODO: Refactorn vll
        controlBreakPoint($scope.operations[DataPic.Instructioncounter].zeile);
        if($scope.StopFlag==false){
                $scope.oneStep();
        }



        runner=$timeout(function() {
            if($scope.StopFlag==false){
                    $scope.Startapp();
            }
        },1000/DataPic.Takt);
        

    };

    $scope.oneStep = function () {
        $scope.SaveStep();
        if($scope.checkInterrupt()==false){
            $scope.callOperation($scope.operations[DataPic.Instructioncounter].befehl);
            if(DataPic.Taktanzahl % $scope.calculatePrescale() == 0 && DataPic.Taktanzahl>=4){
                $scope.runTimer();
            }
        }
        if(DataPic.GotoFlag==1){
            DataPic.GotoFlag=0;
        }else{
            DataPic.Instructioncounter++;
        }
        DataPic.AnzeigeIC++; //Angezeigter Operationszähler
        $scope.Laufzeit=DataPic.Laufzeit;
        $scope.Instructioncounter = DataPic.AnzeigeIC;
        //checkBreakPoint(); ///TODO macht an dieser Stelle wenig sinn da man ansonsten nicht über den Breakpoint hinwegkommt
        //checkInterrupt();ui


    };
    $scope.reset = function () {
        $scope.resetPic();
    };

    $scope.stoppapp = function () {
        $scope.StopFlag=true;

    };
    $scope.SaveStep = function (){
        var tempIC= DataPic.Instructioncounter;
        var tempram=[];
        for (var i=0; i<=$scope.ram.length-1;i++){
            tempram[i]=$scope.ram[i];
        }
        var tempAIC=DataPic.AnzeigeIC;
        var tempW= $scope.w_reg;
        var tempDC= $scope.digitCarry;
        var tempC= $scope.carry;
        var tempZF= $scope.zeroFlag;
        var tempLZ=DataPic.Laufzeit;

        DataPic.SaveLastStep(tempIC,tempram,tempAIC,tempW,tempDC,tempC,tempZF,tempLZ);
    };
    $scope.checkActive = function (line){
        var vergleichsline= line.split(' ');
        if(vergleichsline[0]==$scope.operations[DataPic.Instructioncounter].zeile){
            return true;
        }else {
            return false;
        }
    };
    //Funktion zum Abprüfen ob eine BreakpointCheckbox angezeigt werden soll in der Zeile oder nicht
    $scope.checkBreakpoint= function (line) {
        if (/[0-9a-fA-F]{4}\s*[0-9a-fA-F]{4}/.test(line)) {
            return true
        }
        else {
            return false
        }
    };

    $scope.oneStepBack = function (){
        var lastState = DataPic.LastState[DataPic.LastState.length-1];

        $scope.rollBackState(lastState);
        $scope.Instructioncounter = DataPic.AnzeigeIC;
        $scope.Laufzeit = DataPic.Laufzeit;
        DataPic.LastState.pop();

    };
    
    $scope.changeBreakPoint = function (BreakLine) {

        var tempLine= BreakLine.split(' ');
        var breakLine = tempLine[0];
        var vorhandenFlag=false;


        for(var i=0; i<=DataPic.BreakPointArray.length-1;i++){
            if(breakLine==DataPic.BreakPointArray[i]){
                DataPic.BreakPointArray.splice(i,1);
                vorhandenFlag=true;
            }
        }

        if(vorhandenFlag==false){
            DataPic.BreakPointArray.push(breakLine);
        }
    };

    function controlBreakPoint(currentLine){
        for (var i=0; i<=DataPic.BreakPointArray.length-1;i++){
            if(currentLine == DataPic.BreakPointArray[i]){
                $scope.stoppapp();
                break;
            }
        }
    }
    $scope.runTimer = function () {
        var tempTMR0 = parseInt($scope.ram[1], 16);
        if (tempTMR0 == 255) {
            var tempIntcon = parseInt($scope.ram[11], 16);
            var IntconArray = [];

            for (var i = 0; i < 8; i++) {
                   IntconArray[i] = (tempIntcon >> i) & 1;
            }
            IntconArray[2] = 1;

            var FinalIntcon = "";
            FinalIntcon = IntconArray[7].toString() + IntconArray[6].toString()
                        + IntconArray[5].toString() + IntconArray[4].toString()
                        + IntconArray[3].toString() + IntconArray[2].toString()
                        + IntconArray[1].toString() + IntconArray[0].toString();
            FinalIntcon = parseInt(FinalIntcon, 2);
            FinalIntcon = FinalIntcon.toString(16);
            $scope.ram[11] = FinalIntcon;
            $scope.T0IF=1;
            tempTMR0=0;
            $scope.ram[1]=tempTMR0.toString(16);

            } else {
                tempTMR0++;
                $scope.ram[1] = tempTMR0.toString(16);
            }
        };

    //GIE und T0IE Watcher meldet jede änderung am ram[11] und check ob die bedingungen erfult wurden
    $scope.$watch('ram[11]', function() {
        if((parseInt($scope.ram[11],16)&parseInt("10000000",2))==128){
            $scope.GIE=1;
        }else{
            $scope.GIE=0;
        }
        if((parseInt($scope.ram[11],16)&parseInt("00100000",2))==32){
            $scope.T0IE=1;
        }else{
            $scope.T0IE=0;
        }
        if((parseInt($scope.ram[11],16)&parseInt("00010000",2))==16){
            $scope.INTE=1;
        }else{
            $scope.INTE=0;
        }
        if((parseInt($scope.ram[11],16)&parseInt("00001000",2))==8){
            $scope.RBIE=1;
        }else{
            $scope.RBIE=0;
        }

    });
    
    $scope.$watch('ram[6]',function (newValue, oldValue) {

        if((parseInt($scope.ram[81],16)&&parseInt("01000000",2))==62){
            alert("Steigende Flanke");
            if(((parseInt(oldValue,16)&&parseInt("00000001",2))==0)&&((parseInt(newValue,16)&&parseInt("00000001",2))==1)){
                alert("gefunden!");
                $scope.RB0InterruptFlag=1;
                $scope.ram[11]=(parseInt($scope.ram[11],16)|parseInt("00000010",2)).toString(16);
            }else{
                $scope.RB0InterruptFlag=0;
            }
        }else{
            if(((parseInt(oldValue,16)&&parseInt("00000001",2))==1)&&((parseInt(newValue,16)&&parseInt("00000001",2))==0)){
                $scope.RB0InterruptFlag=1;
                $scope.ram[11]=(parseInt($scope.ram[11],16)|parseInt("00000010",2)).toString(16);
            }else{
                $scope.RB0InterruptFlag=0;
            }
        }
        if(parseInt($scope.ram[6],16)>15){
            $scope.RBIF=1;
            $scope.ram[11]=(parseInt($scope.ram[11],16)|parseInt("00000001",2)).toString(16);
        }else{
            $scope.RBIF=0;
        }
    });
    $scope.checkInterrupt = function (){

        if  (((($scope.T0IE&&$scope.T0IF)&&$scope.GIE))||
            ((($scope.INTE&&$scope.RB0InterruptFlag)&&$scope.GIE))||
            (($scope.RBIE&&$scope.RBIF)&&$scope.GIE)){
            $scope.ram[11]=(parseInt($scope.ram[11],16)&parseInt("01111111",2)).toString(16);
            DataPic.ProgramStack.push(DataPic.Instructioncounter);
            $scope.ProgramStack=DataPic.ProgramStack;
            DataPic.Instructioncounter=4;
            DataPic.GotoFlag=1;
            return true;
        }else {
            return false;
        }
    };

});
/*

*/