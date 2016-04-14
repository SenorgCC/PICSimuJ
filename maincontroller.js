/**
 * Created by Alex on 06.04.2016.
 */
//TODO: Bit Größe des Registers rausfinden! ->
//es werden das Register (Reg), Instructionpointer (IP) und Flags: Zero (ZF), Carry(CY) und Faultflag (Fl)

    var intstructioncounter=0;

var app=angular.module('pic',[]);
//die Maincontroller Funktion steuert sämtliche eingaben auf der Hauptseite
app.controller('Befehlsspeichercontroller',function($scope){

    // ShowConten Visualisiert die eingegebene Datei und erstellt ein Objekt Array für die weitere Verarbeitung
    $scope.showContent = function($fileContent){
        var befehlssatz=new Array();
        befehlssatz = $fileContent.split('\n');
        $scope.content = befehlssatz;

        var tempbefehlsarray=new Array();

        //Unsicher, ob operations abgebildet werden soll
        $scope.operations = new Array();

        //Schleife filter die wichtigen Befehle aus dem Quellcode
        for(var i=0; i<=befehlssatz.length-1;i++) {

            //Regulärer Ausdruck überprüft auf Befehlszeilen, bestehe aus 2 Hexblöcken : 001A 145F
            if (/[0-9a-fA-F]{4}\s*[0-9a-fA-F]{4}/.test(befehlssatz[i])) {

                //Der Zeilencounter und befehl sind mit einem Blank getrennt, split teilt dieses array auf
                tempbefehlsarray=befehlssatz[i].split(' ');

                //Die zwei werte werden zur übergabe an die CPU im Operations - Objekt Array gespeichert
                //Da die Befelszeile in ein Array gesplittet -> ersten 2 Stellen der Zeilencounter und der Befehl
                //Befehlscounter dient zur korrekten sortierung von Befehlen

                $scope.operations.push({zeile:tempbefehlsarray[0],befehl:tempbefehlsarray[1]});
            }

        }

    };


});

app.controller('ramcontroller',function($scope){


        befehlsspeicher = new Array();
        var a=2 ;
        for (var i = 0; i < 8; i++) {
            befehlsspeicher[i]=new Array();
            for (var j = 0; j < 8; j++) {

                befehlsspeicher[i][j] =00;
            }
        }

    $scope.ram=befehlsspeicher;
    alert(($scope.ram));

});


//Angularmagic zum Parsen von Dateien
app.directive('onReadFile', function ($parse) {
    return {
        restrict: 'A',
        scope: false,
        link: function(scope, element, attrs) {
            var fn = $parse(attrs.onReadFile);

            element.on('change', function(onChangeEvent) {
                var reader = new FileReader();
                reader.onload = function(onLoadEvent) {
                    scope.$apply(function() {
                        fn(scope, {$fileContent:onLoadEvent.target.result});
                    });
                };

                reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
            });
        }
    };
});
