app.controller('Befehlsspeichercontroller', function ($scope) {

    // ShowConten Visualisiert die eingegebene Datei und erstellt ein Objekt Array für die weitere Verarbeitung
    $scope.showContent = function ($fileContent) {
        var befehlssatz = new Array();                            //[]
        befehlssatz = $fileContent.split('\n');                 //[0001 ORG 0, ....]
        $scope.content = befehlssatz;                           //Array ausgabe mittels ng-repeat simpel

        var tempbefehlsarray = new Array();                       //befehlszwischenspeicher

        //Unsicher, ob operations abgebildet werden soll
        $scope.operations = new Array();                        //Echter Befehlsspeicher Objektarray

        //Schleife filter die wichtigen Befehle aus dem Quellcode
        for (var i = 0; i <= befehlssatz.length - 1; i++) {

            //Regulärer Ausdruck überprüft auf Befehlszeilen, bestehe aus 2 Hexblöcken : 001A 145F
            if (/[0-9a-fA-F]{4}\s*[0-9a-fA-F]{4}/.test(befehlssatz[i])) {

                //Der Zeilencounter und befehl sind mit einem Blank getrennt, split teilt dieses array auf
                tempbefehlsarray = befehlssatz[i].split(' ');
                //[0000, 1683, , , , , , , 00016]

                //Die zwei werte werden zur übergabe an die CPU im Operations - Objekt Array gespeichert
                //Da die Befelszeile in ein Array gesplittet -> ersten 2 Stellen der Zeilencounter und der Befehl
                //Befehlscounter dient zur korrekten sortierung von Befehlen

                $scope.operations.push({zeile: tempbefehlsarray[0], befehl: tempbefehlsarray[1]});
            }

        }

    };


});
//Angularmagic zum Parsen von Dateien
//Schwarze Magie
app.directive('onReadFile', function ($parse) {
    return {
        restrict: 'A',
        scope: false,
        link: function (scope, element, attrs) {
            var fn = $parse(attrs.onReadFile);

            element.on('change', function (onChangeEvent) {
                var reader = new FileReader();
                reader.onload = function (onLoadEvent) {
                    scope.$apply(function () {
                        fn(scope, {$fileContent: onLoadEvent.target.result});
                    });
                };

                reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
            });
        }
    };
});