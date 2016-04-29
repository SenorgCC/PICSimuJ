app.controller('Counter', function ($scope){
    $scope.Takt=0;
    $scope.Zeit;
    function Instructioncounter(takte){
        

        $scope.Zeit=1/$scope.Takt;
        alert ($scope.Zeit);
    }
});