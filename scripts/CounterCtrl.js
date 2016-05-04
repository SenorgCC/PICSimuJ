app.controller('Counter', function ($scope, storage){
    $scope.Laufzeit=0;

    $scope.items = storage.get();

   $scope.Zeit = function (takte){
        $scope.Laufzeit = $scope.Laufzeit + ((1 / $scope.selectedItem.Takt) * takte);
        alert ($scope.Laufzeit);
       alert($scope.items);
    };
});