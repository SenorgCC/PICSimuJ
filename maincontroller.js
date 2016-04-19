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

app.controller('CPU',function($scope){

    $scope.callOperation=function(hexOP) {
        var befehl;
        var temp = parseInt(hexOP, 16);
        var tempbin = temp.toString(2);
        //abfrage auf den Befehl anführende "00" werden leider ausgeschnitten und js kann nativ kein binary

        if((parseInt(tempbin,2)&parseInt('11111100000000',2)).toString(2)=="11100000000"){
            //Befehl ADDWF
            alert("ADDWF");

        }else if((parseInt(tempbin,2)&parseInt('11111100000000',2)).toString(2)=="10100000000"){
            //ANDWF
            alert("ANDWF");

        }else if((parseInt(tempbin,2)&parseInt('11111110000000',2)).toString(2)=="00110000000"){
            //CLRF
            alert("CLRF");

        }else if((parseInt(tempbin,2)&parseInt('11111110000000',2)).toString(2)=="100000000"){
            //CLRW
            alert("CLRW");

        }else if((parseInt(tempbin,2)&parseInt('11111100000000',2)).toString(2)=="100100000000"){
            //COMF
            alert("COMF");

        }else if(kek){

        }else if(){

        }else if(){

        }else if(){

        }else if(){

        }else if(){

        }else if(){

        }else if(){

        }else if(){

        }else if(){

        }else if((parseInt(tempbin,2)&parseInt('11110000000000',2)).toString(2)=="1010000000000"){

            //ausführung für den Befehl BSF kommt hierhin
            ///TODO me: Lookuplists anschauen

            alert("Befehl: BSF");

        }else if((parseInt(tempbin,2)&parseInt('11110000000000',2)).toString(2)=="1000000000000"){

            //call befehl BCF
            alert("Befehl: BCF")
        }else if((parseInt(tempbin,2)&parseInt('11110000000000',2)).toString(2)=="1100000000000"){
            //call Befehel: BTFSC

        }else if((parseInt(tempbin,2)&parseInt('11110000000000',2)).toString(2)=="1110000000000"){

            //call Befehl: BTFSS

        }


    }

});

app.controller('ramcontroller',function($scope){
    $scope.Indirect_addr='00';
    $scope.TMR0='00';
    $scope.OPTION_REG='00';
    $scope.PCL='00';
    $scope.STATUS='00';
    $scope.FSR='00';
    $scope.PORTA='00';
    $scope.PORTB='00';
    $scope.EEDATA='00';
    $scope.EECON1='00';
    $scope.EEADR='00';
    $scope.EECON2='00';
    $scope.PCLATH='00';
    $scope.INTCON='00';

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
