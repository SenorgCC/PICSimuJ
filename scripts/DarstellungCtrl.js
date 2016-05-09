/**
 * Created by harmi on 29.04.2016.
 */
app.controller('DropdownCtrl', function ($scope, DataPic) {

    $scope.items=
        [
            {id: '1', name : '32,767 kHz', Takt : 0.032767},
            {id: '2', name : '500 kHz', Takt : 0.5},
            {id: '3', name : '1 MHz', Takt: 1},
            {id: '4', name : '2 MHz', Takt: 2},
            {id: '5', name : '4 MHz', Takt: 4},
            {id: '6', name : '8 MHz', Takt: 8},
            {id: '7', name : '16 MHz', Takt: 16},
            {id: '8', name : '20 MHz', Takt : 20},
            {id : '9', name : '32 MHz', Takt : 32}
        ];
    $scope.selectedItem = $scope.items[3];

    $scope.save = function (data) {
        DataPic.Takt=data;
    };
    $scope.save($scope.selectedItem.Takt);
    
    $scope.changetakt = function(){
        $scope.save(this.selectedItem.Takt);
    }


});

app.controller('UploadCtrl', function ($scope) {
    /*Controller für das Label neben dem Uploadbutton zur Dateinamenanzeige*/
    $(document).ready(function () {
        $('#uploadBtn').change(function() {
            var filename = $('#uploadBtn').val().split('\\').pop();
            $('#uploadFile').val(filename);
        });
    });
});

