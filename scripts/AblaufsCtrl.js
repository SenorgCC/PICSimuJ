/**
 * Created by Alex on 02.05.2016.
 */

app.controller("AblaufsCtrl",function($scope,DataPic,$timeout){
    $scope.StopFlag=false;
    DataPic.Instructioncounter=0;
    var testsequenzeline;
    var temp1,temp2;


    $scope.Startapp = function () {

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

    function sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds){
                break;
            }
        }
    }
    $scope.oneStep = function () {
       // $scope.SaveStep();
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
        $scope.StopFlag=true;
    };
    $scope.SaveStep = function (){
        DataPic.LastState.push({IC:DataPic.Instructioncounter,Ram:$scope.Ram,ICAnzeige:$scope.Instructioncounter});
    }
    $scope.checkActive = function (line){
        var vergleichsline= line.split(' ');
        if(vergleichsline[0]==$scope.operations[DataPic.Instructioncounter].zeile){
            return true;
        }else {
            return false;
        }
    };


});
/*

*/