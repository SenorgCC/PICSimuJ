/**
 * Created by Alex on 02.05.2016.
 */

app.controller("AblaufsCtrl",function($scope,DataPic,$timeout){
    $scope.StopFlag=false;
    DataPic.Instructioncounter=0;
    var testsequenzeline;
    var temp1,temp2;


    $scope.Startapp = function () {
        DataPic.Instructioncounter=0;

        $scope.StopFlag=false;

        if($scope.StopFlag==false){
            $scope.oneStep();
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
        $scope.Instructioncounter++; //Angezeigter Operationszähler
        $scope.Laufzeit=DataPic.Laufzeit;
        //checkBreakPoint();
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
        $scope.Instructioncounter=0;
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

        DataPic.SaveLastStep(
            DataPic.Instructioncounter,
            DataPic.ram,
            $scope.Instructioncounter,
            $scope.w_reg,
            $scope.digitCarry,
            $scope.carry,
            $scope.zeroFlag,
            DataPic.Laufzeit
        );
    };
    $scope.checkActive = function (line){
        var vergleichsline= line.split(' ');
        if(vergleichsline[0]==$scope.operations[DataPic.Instructioncounter-1].zeile){
            return true;
        }else {
            return false;
        }
    };

    $scope.oneStepBack = function (){
        var lastState = DataPic.LastState[DataPic.LastState.length-2];
        DataPic.ram = lastState.ram;
        $scope.w_reg= lastState.w_reg;
        DataPic.Instructioncounter = lastState.InstructionCounter;  //lastState.Instructioncounter
        $scope.Instructioncounter =lastState.AnzeigeIC; // lastState.AnzeigeIC
        $scope.digitCarry = lastState.digitCarry;
        $scope.carry = lastState.carry;
        $scope.zeroFlag = lastState.zeroFlag;
        DataPic.LastState.pop();

    };


});
/*

*/