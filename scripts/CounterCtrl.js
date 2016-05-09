app.controller('Counter', function ($scope, DataPic){
    $scope.Zeit = function (takte) {
        DataPic.Laufzeit= DataPic.Laufzeit + (1/DataPic.Takt)* takte;
        alert(DataPic.Laufzeit);
        ///TODO: Alert entfernen
    }


});