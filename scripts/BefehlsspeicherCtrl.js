app.controller('Befehlsspeichercontroller', function ($scope) {

    // ShowConten Visualisiert die eingegebene Datei und erstellt ein Objekt Array für die weitere Verarbeitung
    $scope.showContent = function ($fileContent) {
        var befehlssatz = new Array();                  // []
        befehlssatz = $fileContent.split('\n');         // [0001 ORG 0, ....]
        $scope.content = befehlssatz;                   // Arrayausgabe im View mittels ng-repeat simpel
        var tempbefehlsarray = new Array();             // befehlszwischenspeicher

        //Unsicher, ob operations abgebildet werden soll
        $scope.operations = new Array(); //Echter Befehlsspeicher Objektarray
        $scope.ProgramStack= new Array();   //Wird für die Call Operation benötigt, um die Korrekte einsprunstelle wieder zu finden
        $scope.ProgramCounter= new Array(13); //ProgrammCounter hat eine vordefinierte länge von 13 Bit



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
