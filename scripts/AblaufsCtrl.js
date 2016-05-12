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
        $scope.runTimer();
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
        $scope.callOperation($scope.operations[DataPic.Instructioncounter].befehl);
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
        for(var i=0; i<=$scope.ram.length-1;i++){
            $scope.ram[i]=0;
        }
        ///TODO Faktory auslagern
        $scope.PCL='00';
        $scope.ram[3]='18';
        $scope.STATUS=$scope.ram[3];
        DataPic.Instructioncounter=0;
        $scope.Instructioncounter=0;
        DataPic.AnzeigeIC=0;
        $scope.StopFlag=1;
        $scope.ProgramCounter=0;
        $scope.ProgramStack=[];
        $scope.zeroFlag=0;
        $scope.digitCarry=0;
        $scope.carry=0;
        $scope.watchdogtimer=0;
        $scope.w_reg='00';
        DataPic.Laufzeit=0;
        $scope.Laufzeit=0;
        $scope.OPTION_REG='ff';
        $scope.TRISA='1f';
        $scope.TRISB='ff';

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
        if(vergleichsline[0]==$scope.operations[DataPic.Instructioncounter-1].zeile){
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
        $scope.StopFlag = false;
        var Teilerfaktor = $scope.calculateVerzug();
        var Timerunner;
        if ($scope.StopFlag == false) {

            var tempTMR0 = parseInt($scope.ram[1], 16);
            if (tempTMR0 == 255) {
                var tempIntcon = parseInt($scope.ram[11], 16);
                var IntconArray = [];

                for (var i = 0; i < 8; i++) {
                    IntconArray[i] = (tempIntcon >> i) & 1;
                }
                IntconArray[3] = 1;

                var FinalIntcon = "";
                FinalIntcon = IntconArray[7].toString() + IntconArray[6].toString()
                    + IntconArray[5].toString() + IntconArray[4].toString()
                    + IntconArray[3].toString() + IntconArray[2].toString()
                    + IntconArray[1].toString() + IntconArray[0].toString();
                FinalIntcon = parseInt(FinalIntcon, 2);
                FinalIntcon = FinalIntcon.toString(16);
                $scope.ram[11] = FinalIntcon;
                $scope.TMR0Flag=1;
                tempTMR0=0;
                $scope.ram[1]=tempTMR0.toString(16);

            } else {
                tempTMR0++;
                $scope.ram[1] = tempTMR0.toString(16);
            }
        }

        Timerunner = $timeout(function () {
            if ($scope.StopFlag == false) {
                $scope.runTimer();
            }
        }, Teilerfaktor / (DataPic.Takt * 1000000));

    };



    
});
/*

*/