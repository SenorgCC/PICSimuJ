/**
 * Created by Alex on 02.05.2016.
 */

app.controller("AblaufsCtrl",function($scope,DataPic){
    $scope.StopFlag=0;
    DataPic.Instructioncounter=0;

    $scope.Startapp = function () {
        $scope.StopFlag=0;

        while($scope.StopFlag==0){
            $scope.callOperation($scope.operations[DataPic.Instructioncounter].befehl);
            if(DataPic.GotoFlag==1){
                DataPic.GotoFlag=0;
            }else{
                DataPic.Instructioncounter++;
            }
            $scope.Instructioncounter++;
            //checkBreakPoint();
            //checkInterrupt();
            //saveStep();
        }

    };

    function sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds){
                break;
            }
        }
    }
    $scope.oneStep = function () {
        $scope.callOperation($scope.operations[DataPic.Instructioncounter].befehl);
        if(DataPic.GotoFlag==1){
            DataPic.GotoFlag=0;
        }else{
            DataPic.Instructioncounter++;
        }
        $scope.Instructioncounter=DataPic.Instructioncounter;

    };
    $scope.reset = function () {
        for(var i=0; i<$scope.ram.length;i++){
            $scope.ram[i]='00';
        }
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
        $scope.StopFlag=1;
    };


});