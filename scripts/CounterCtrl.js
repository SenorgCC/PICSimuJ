app.controller('Counter', function ($scope, DataPic){
    $scope.Zeit = function (takte) {
        alert(DataPic.Takt);
        DataPic.Laufzeit= DataPic.Laufzeit + (1/DataPic.Takt)* takte;
        alert(DataPic.Laufzeit);
    }


});