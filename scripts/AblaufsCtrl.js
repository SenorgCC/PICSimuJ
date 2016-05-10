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


    $scope.Startapp = function () {
        DataPic.Instructioncounter=0;

        $scope.StopFlag=false;
        
        if($scope.StopFlag==false){
            if ($scope.breakpointbox==false) {
                    $scope.oneStep();
            }
        }

            var runner;
            runner=$timeout(function() {
                if($scope.StopFlag==false){
                $scope.Startapp()
                }
            },1000);
        

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
        for(var i=0; i<DataPic.ram.length;i++){
            DataPic.ram[i]=0;
        }
        ///TODO Faktory auslagern
        $scope.PCL='00';
        $scope.STATUS='18';
        DataPic.Instructioncounter=0;
        DataPic.AnzeigeIC=0;
        $scope.StopFlag=1;
        $scope.ProgramCounter=0;
        $scope.ProgramStack=0;
        $scope.zeroFlag=0;
        $scope.digitCarry=0;
        $scope.carry=0;
        $scope.watchdogtimer=0;
        $scope.w_reg='00';
        $scope.PowerDownbit=0;
        $scope.TimeOutbit=0;

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
        DataPic.LastState.pop();

    };
    
});
/*

*/