/**
 * Created by Alex on 02.05.2016.
 */

app.controller("AblaufsCtrl",function($scope){
    $scope.StopFlag=0;
    $scope.Instructioncounter=0;
    $scope.GotoFlag=0;

    $scope.Startapp = function () {


        while($scope.StopFlag==0){
            $scope.callOperation($scope.operations[$scope.Instructioncounter].befehl);
            if($scope.GotoFlag==1){
                $scope.GotoFlag=0;
            }else{
                $scope.Instructioncounter++;
            }

            //checkBreakPoint();
            //checkInterrupt();
            //saveStep();
        }

    };
    $scope.reset = function () {
        for(var i=0; i<$scope.ram.length;i++){
            $scope.ram[i]='00';
        }
        $scope.PCL='00';
        $scope.STATUS='18';
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