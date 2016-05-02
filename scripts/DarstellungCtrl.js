/**
 * Created by harmi on 29.04.2016.
 */
app.controller('DropdownCtrl', function ($scope) {
   /*Controller für den Dropdownbutton der Taktauswahl*/ 
    $(document).ready(function () {
        $('.selectpicker').selectpicker({
            style: 'btn-info'
        });
        $('.selectpicker').on('change',function () {
            $scope.Takt = $(this).val();
        });
    });
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

