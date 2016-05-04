app.controller('Counter', function ($scope){
    $scope.Takt=1;
    $scope.Laufzeit=0;
   $scope.Zeit = function (takte){
        $scope.Laufzeit = $scope.Laufzeit + (1 / $scope.Takt * takte);
        alert ($scope.Laufzeit);
    };
    //$scope.Counter=Zeit(takte);
});