/**
 * Created by Alex on 06.04.2016.
 */
//TODO: Bit Größe des Registers rausfinden! ->
//es werden das Register (Reg), Instructionpointer (IP) und Flags: Zero (ZF), Carry(CY) und Faultflag (Fl)
var Reg, IP, ZF, CY, FL;
var app=angular.module('pic',[]);
//die Maincontroller Funktion steuert sämtliche eingaben auf der Hauptseite
app.controller('Befehlsspeichercontroller',function($scope){

    // ShowConten Visualisiert die eingegebene Datei und erstellt ein Objekt Array für die weitere Verarbeitung
    $scope.showContent = function($fileContent){
        var befehlssatz=new Array();
        befehlssatz = $fileContent.split('\n');
        $scope.content = befehlssatz;
//TODO me: Eingehenden Dateien aus einem Array in ein Obejkt mit Zeilenpos, Operator, Arg1, Arg2 und Kommentar umwandeln
    };



    var Befehlsinterpretation = function(){

    };

    var Startfunction = function (){

    };

    var Stopfunction = function (){

    };

    var Resetfunction = function (){

        Reg=[0,0,0,0,0];
        IP=0;
        ZF=false;
        CY=false;
        FL=false;
    };
});

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