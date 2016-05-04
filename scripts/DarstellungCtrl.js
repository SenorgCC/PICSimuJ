/**
 * Created by harmi on 29.04.2016.
 */
app.controller('DropdownCtrl',['$scope', function ($scope, storage) {
   /*Controller für den Dropdownbutton der Taktauswahl*
    $(document).ready(function () {
        $('.selectpicker').selectpicker({
            style: 'btn-info'
        });
        $('.selectpicker').on('change',function () {
            $scope.Takt = $(this).val();
        });
    });*/
    $scope.items=
        [
        {id: '1', name : '2 MHz', Takt: 2},
        {id: '2', name : '4 MHz', Takt: 4},
        {id: '3', name : '8 MHz', Takt: 8}
        ];
    $scope.selectedItem = $scope.items[0];

    $scope.save = function (data) {
        storage.add(data);
    };
    $scope.save($scope.selectedItem.Takt);


}]);

app.controller('UploadCtrl', function ($scope) {
    /*Controller für das Label neben dem Uploadbutton zur Dateinamenanzeige*/
    $(document).ready(function () {
        $('#uploadBtn').change(function() {
            var filename = $('#uploadBtn').val().split('\\').pop();
            $('#uploadFile').val(filename);
        });
    });
});

