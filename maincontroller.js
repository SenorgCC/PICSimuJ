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
        var befehlssatz=new Array();                            //[]
        befehlssatz = $fileContent.split('\n');                 //[0001 ORG 0, ....]
        $scope.content = befehlssatz;                           //Array ausgabe mittels ng-repeat simpel

        var tempbefehlsarray=new Array();                       //befehlszwischenspeicher

        //Unsicher, ob operations abgebildet werden soll
        $scope.operations = new Array();                        //Echter Befehlsspeicher Objektarray

        //Schleife filter die wichtigen Befehle aus dem Quellcode
        for(var i=0; i<=befehlssatz.length-1;i++) {

            //Regulärer Ausdruck überprüft auf Befehlszeilen, bestehe aus 2 Hexblöcken : 001A 145F
            if (/[0-9a-fA-F]{4}\s*[0-9a-fA-F]{4}/.test(befehlssatz[i])) {

                //Der Zeilencounter und befehl sind mit einem Blank getrennt, split teilt dieses array auf
                tempbefehlsarray=befehlssatz[i].split(' '); [0000,1683,,,,,,,00016]

                //Die zwei werte werden zur übergabe an die CPU im Operations - Objekt Array gespeichert
                //Da die Befelszeile in ein Array gesplittet -> ersten 2 Stellen der Zeilencounter und der Befehl
                //Befehlscounter dient zur korrekten sortierung von Befehlen

                $scope.operations.push({zeile:tempbefehlsarray[0],befehl:tempbefehlsarray[1]});
            }

        }

    };


});

app.controller('ramcontroller',function($scope){

//Dummy zum befüllen des rams
    var GPR1 = new Array();
        for (var i = 0; i < 68; i++) {
            GPR1[i] ='00';
        }

    $scope.ram=GPR1;

    $scope.getValue= function(hexAdr) {

        alert("TEST4");

        //Dekodierung zur Dezimalzahl
        var decAdr=parseInt(hexAdr,16);

        //Der RAM begint bei 0Ch -> 12d damit ist die erste Position im Array nicht 0 sondern 12
        var ramAdr=decAdr-12;

        //Ifabfrage zum Bestimmen der Array Reihe

        if(ramAdr>67){
            alert("Falsche Zuweisung!");
            return 0;
        }else{
            alert ($scope.ram[decAdr]);
            return $scope.ram[decAdr];
        }
    };

    $scope.setValue= function(hexAdr, Wert){

        //Dekodierung zur Dezimalzahl
        var decAdr=parseInt(hexAdr,16);

        //Der RAM begint bei 0Ch -> 12d damit ist die erste Position im Array nicht 0 sondern 12
        var ramAdr=decAdr-12

        $scope.ram[decAdr]=Wert;
    };

});
//hh

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
