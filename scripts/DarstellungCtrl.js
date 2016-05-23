app.controller('DropdownCtrl', function ($scope, DataPic) {
    // Elemente für das Dropdownmenü
    $scope.items =
        [
            {id: '0', name: '32,767 kHz', Takt: 0.032767},
            {id: '1', name: '500 kHz', Takt: 0.5},
            {id: '2', name: '1 MHz', Takt: 1},
            {id: '3', name: '2 MHz', Takt: 2},
            {id: '4', name: '4 MHz', Takt: 4},
            {id: '5', name: '8 MHz', Takt: 8},
            {id: '6', name: '16 MHz', Takt: 16},
            {id: '7', name: '20 MHz', Takt: 20},
            {id: '8', name: '32 MHz', Takt: 32}
        ];
    // Festlegen des Default-Wertes für das Dropdownmenü
    $scope.selectedItem = $scope.items[3];
    // Funktion für das Speichern des Taktes in der Factory
    $scope.save = function (data) {
        DataPic.Takt = data;
    };
    // Speichern des Taktes der ausgewählten Option
    $scope.save($scope.selectedItem.Takt);
    // Funktionsaufruf für das Speichern eines geänderten Taktes
    $scope.changetakt = function () {
        $scope.save(this.selectedItem.Takt);
    }
});

// Controller für das Label neben dem Uploadbutton zur Dateinamenanzeige
app.controller('UploadCtrl', function ($scope) {
    // JQuery muss mit $Doc.ready beginnen, dass es erst nach dem Ladevorgang startet
    $(document).ready(function () {
        // Reagiert auf die Änderung des Upload Buttons
        $('#uploadBtn').change(function () {
            // Auslesen des Pfades, der mit "\\" getrennt wird bis nur noch das letzte Element übrig bleibt (der Name)
            var filename = $('#uploadBtn').val().split('\\').pop();

            // Setzt den Wert des Labels auf den Wert von filename
            $('#uploadFile').val(filename);
        });
    });
});

