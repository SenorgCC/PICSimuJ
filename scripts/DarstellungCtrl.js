/**
 * Created by harmi on 29.04.2016.
 */
app.controller('DropdownCtrl', function ($scope) {


    $(document).ready(function () {
        $('.selectpicker').selectpicker({
            style: 'btn-info'
        });
        $('.selectpicker').on('change',function () {
            $scope.Takt = $(this).val();
            alert($scope.Takt);

        });


    });
});


/*document.getElementById("uploadBtn").onchange = function () {
    document.getElementById("uploadFile").value = this.value;
};*/