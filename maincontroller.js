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

    function getDirectory(binOP){
        var directory = parseInt(tempbin,2)&parseInt('00000010000000');
        return directory;
    }
    function getFileregister(binOP){
        var file = parseInt(tempbin,2)&parseInt('00000001111111');
        return file;
    }
    function getbitAddress(binOP){
        var bitAddress = parseInt(tempbin,2)&parseInt('00001110000000');
        return bitAddress;
    }
    function getLiteralfieldshort(binOP){
        var literalfield = parseInt(tempbin,2)&parseInt('00000011111111');
        return literalfield;
    }
    function getLiteralfieldlong(binOP){
        var literalfield = parseInt(tempbin,2)&parseInt('00011111111111');
        return literalfield;
    }

    $scope.callOperation=function(hexOP) {
        var befehl;
        var temp = parseInt(hexOP, 16);
        var tempbin = temp.toString(2);

        //abfrage auf den Befehl anführende "00" werden leider ausgeschnitten und js kann nativ kein binary

        if((parseInt(tempbin,2)&parseInt('11111100000000',2)).toString(2)=="11100000000"){
            //Befehl ADDWF

            Befehlsausfuehrung["ADDWF"](getFileregister(tempbin),getDirectory(tempbin));

        }else if((parseInt(tempbin,2)&parseInt('11111100000000',2)).toString(2)=="10100000000"){
            //ANDWF
            Befehlsausfuehrung["ANDWF"](getFileregister(tempbin),getDirectory(tempbin));

        }else if((parseInt(tempbin,2)&parseInt('11111110000000',2)).toString(2)=="110000000"){
            //CLRF
            Befehlsausfuehrung["ADDWF"](getFileregister(tempbin),getDirectory(tempbin));

        }else if(((parseInt(tempbin,2)&parseInt('11111110000000',2))>255)&((parseInt(tempbin,2)&parseInt('11111110000000',2))<384)){
            //CLRW
            Befehlsausfuehrung["CLRW"]();

        }else if((parseInt(tempbin,2)&parseInt('11111100000000',2)).toString(2)=="100100000000"){
            //COMF
            Befehlsausfuehrung["COMF"](getFileregister(tempbin),getDirectory(tempbin));

        }else if((parseInt(tempbin,2)&parseInt('11111100000000',2)).toString(2)=="1100000000"){
            //DECF
            Befehlsausfuehrung["DECF"](getFileregister(tempbin),getDirectory(tempbin));

        }else if((parseInt(tempbin,2)&parseInt('11111100000000',2)).toString(2)=="101100000000"){
            //DECFSZ
            Befehlsausfuehrung["DECFSZ"](getFileregister(tempbin),getDirectory(tempbin));

        }else if((parseInt(tempbin,2)&parseInt('11111100000000',2)).toString(2)=="101000000000"){
            //INCF
            Befehlsausfuehrung["INCF"](getFileregister(tempbin),getDirectory(tempbin));

        }else if((parseInt(tempbin,2)&parseInt('11111100000000',2)).toString(2)=="111100000000"){
            //INCFSZ
            Befehlsausfuehrung["INCFSZ"](getFileregister(tempbin),getDirectory(tempbin));

        }else if((parseInt(tempbin,2)&parseInt('11111100000000',2)).toString(2)=="10000000000"){
            //IORWF
            Befehlsausfuehrung["IORWF"](getFileregister(tempbin),getDirectory(tempbin));

        }else if((parseInt(tempbin,2)&parseInt('11111100000000',2)).toString(2)=="100000000000"){
            //MOVF
            alert("MOVF");
        }else if((parseInt(tempbin,2)&parseInt('11111100000000',2)).toString(2)=="10000000"){
            //MOVWF
            Befehlsausfuehrung["MOVWF"](getFileregister(tempbin));

        }else if(((parseInt(tempbin,2)&parseInt('11111111111111',2)).toString(2)=="0")
            |((parseInt(tempbin,2)&parseInt('11111111111111',2)).toString(2)=="100000")
            |((parseInt(tempbin,2)&parseInt('11111111111111',2)).toString(2)=="1000000")
            |((parseInt(tempbin,2)&parseInt('11111111111111',2)).toString(2)=="1100000")){
            //NOP
            Befehlsausfuehrung["NOP"]();

        }else if((parseInt(tempbin,2)&parseInt('11111100000000',2)).toString(2)=="110100000000"){
            //RLF
            Befehlsausfuehrung["RLF"](getFileregister(tempbin),getDirectory(tempbin));

        }else if((parseInt(tempbin,2)&parseInt('11111100000000',2)).toString(2)=="110000000000") {
            //RRF
            Befehlsausfuehrung["RRF"](getFileregister(tempbin),getDirectory(tempbin));

        } else if((parseInt(tempbin,2)&parseInt('11111100000000',2)).toString(2)=="1000000000") {
            //SUBWF
            Befehlsausfuehrung["SUBWF"](getFileregister(tempbin),getDirectory(tempbin));

        }else if((parseInt(tempbin,2)&parseInt('11111100000000',2)).toString(2)=="111000000000") {
            //SWAPF
            Befehlsausfuehrung["SWAPF"](getFileregister(tempbin),getDirectory(tempbin));

        }else if((parseInt(tempbin,2)&parseInt('11111100000000',2)).toString(2)=="11000000000"){
            //XORWF
            Befehlsausfuehrung["XORWF"](getFileregister(tempbin),getDirectory(tempbin));

        }else if((parseInt(tempbin,2)&parseInt('11110000000000',2)).toString(2)=="1000000000000"){

            //BCF
            Befehlsausfuehrung["BCF"](getFileregister(tempbin),getbitAddress(tempbin));

        }else if((parseInt(tempbin,2)&parseInt('11110000000000',2)).toString(2)=="1010000000000"){
            //BSF
            Befehlsausfuehrung["BSF"](getFileregister(tempbin),getbitAddress(tempbin));

        }else if((parseInt(tempbin,2)&parseInt('11110000000000',2)).toString(2)=="1100000000000"){
            //call Befehel: BTFSC
            Befehlsausfuehrung["BTFSC"](getFileregister(tempbin),getbitAddress(tempbin));

        }else if((parseInt(tempbin,2)&parseInt('11110000000000',2)).toString(2)=="1110000000000"){

            //call Befehl: BTFSS
            Befehlsausfuehrung["BTFSS"](getFileregister(tempbin),getbitAddress(tempbin));

        }else if(((parseInt(tempbin,2)&parseInt('11111100000000',2)).toString(2)=="11111000000000")
                 |(parseInt(tempbin,2)&parseInt('11111100000000',2)).toString(2)=="11111100000000") {
            //ADDLW
            Befehlsausfuehrung["ADDLW"](getLiteralfieldshort(tempbin));

        }else if((parseInt(tempbin,2)&parseInt('11111100000000',2)).toString(2)=="11100100000000"){
            //ANDLW
            Befehlsausfuehrung["ANDLW"](getLiteralfieldshort(tempbin));

        }else if((parseInt(tempbin,2)&parseInt('11100000000000',2)).toString(2)=="11100000000000"){
            //CALL
            Befehlsausfuehrung["CALL"](getLiteralfieldlong(tempbin));

        }else if((parseInt(tempbin,2)&parseInt('11111111111111',2)).toString(2)=="1100100"){
            //CLRWDT
            Befehlsausfuehrung["CLRWDT"]();

        }else if((parseInt(tempbin,2)&parseInt('11100000000000',2)).toString(2)=="10100000000000"){
            //GOTO
            Befehlsausfuehrung["GOTO"](getLiteralfieldlong(tempbin));

        }else if((parseInt(tempbin,2)&parseInt('11111100000000',2)).toString(2)=="11100000000000"){
            //IORLW
            Befehlsausfuehrung["IORLW"](getLiteralfieldshort(tempbin));

        }else if(((parseInt(tempbin,2)&parseInt('11111100000000',2)).toString(2)=="11000000000000")
                |((parseInt(tempbin,2)&parseInt('11111100000000',2)).toString(2)=="11000100000000")
                |((parseInt(tempbin,2)&parseInt('11111100000000',2)).toString(2)=="11001000000000")
                |((parseInt(tempbin,2)&parseInt('11111100000000',2)).toString(2)=="11001100000000")){

            //MOVLW
            Befehlsausfuehrung["MOVLW"](getLiteralfieldshort(tempbin));

        }else if((parseInt(tempbin,2)&parseInt('11111111111111',2)).toString(2)=="1001"){
            //RETFIE
            Befehlsausfuehrung["RETFIE"]();

        }else if(((parseInt(tempbin,2)&parseInt('11111100000000',2)).toString(2)=="1101000000")
                |((parseInt(tempbin,2)&parseInt('11111100000000',2)).toString(2)=="1101010000")
                |((parseInt(tempbin,2)&parseInt('11111100000000',2)).toString(2)=="1101100000")
                |((parseInt(tempbin,2)&parseInt('11111100000000',2)).toString(2)=="1101110000")){

                    //RETLW
            Befehlsausfuehrung["RETLW"](getLiteralfieldshort(tempbin));

        }else if((parseInt(tempbin,2)&parseInt('11111111111111',2)).toString(2)=="1000"){
                //RETURN
            Befehlsausfuehrung["RETURN"]();

        }else if((parseInt(tempbin,2)&parseInt('11111111111111',2)).toString(2)=="110011"){
            //SLEEP
            Befehlsausfuehrung["SLEEP"]();

        }else if(((parseInt(tempbin,2)&parseInt('11111100000000',2)).toString(2)=="11110000000000")
                |((parseInt(tempbin,2)&parseInt('11111100000000',2)).toString(2)=="11110100000000")){

                //SUBLW
            Befehlsausfuehrung["SUBLW"](getLiteralfieldshort(tempbin));

         }else if((parseInt(tempbin,2)&parseInt('11111100000000',2)).toString(2)=="11101000000000"){
            //XORLW

            Befehlsausfuehrung["XORLW"](getLiteralfieldshort(tempbin));
        }
    }


    var Befehlsausfuehrung={
        "ADDWF":function(f,d){
          //DO SOMETHING
        },
        "ANDWF":function(f,d){
            //DO SOMETHING
        },
        "CLRF":function(f){
            //DO SOMETHING
        },
        "CLRW":function(){
            //DO SOMETHING
        },
        "COMF":function(f,d){
            //DO SOMETHING
        },
        "DECF":function(f,d){
            //DO SOMETHING
        },
        "DECFSZ":function(f,d){
            //DO SOMETHING
        },
        "INCF":function(f,d){
            //DO SOMETHING
        },
        "INCFSZ":function(f,d){
            //DO SOMETHING
        },
        "IORWF":function(f,d){
            //DO SOMETHING
        },
        "MOVF":function(f,d){
            //DO SOMETHING
        },
        "MOVWF":function(f){
            //DO SOMETHING
        },
        "NOP":function(){
            //DO SOMETHING
            alert("JAN DU ELENDIGER SACK");
        },
        "RLF":function(f,d){
            //DO SOMETHING
        },
        "RRF":function(f,d){
            //DO SOMETHING
        },
        "SUBWF":function(f,d){
            //DO SOMETHING
        },
        "SWAPF":function(f,d){
            //DO SOMETHING
        },
        "XORWF":function(f,d){
            //DO SOMETHING
        },
        "BCF":function(f,b){
            //DO SOMETHING
        },
        "BSF":function(f,b){
            //DO SOMETHING
        },
        "BTFSC":function(f,b){
            //DO SOMETHING
        },
        "BTFSS":function(f,b){
            //DO SOMETHING
        },
        "ADDLW":function(k){
            //DO SOMETHING
        },
        "ANDLW":function(k){
            //DO SOMETHING
        },
        "CALL":function(k){
            //DO SOMETHING
        },
        "CRLWDT":function(){
            //DO SOMETHING
        },
        "GOTO":function(k){
            //DO SOMETHING
        },
        "IORLW":function(k){
            //DO SOMETHING
        },
        "MOVLW":function(k){
            //DO SOMETHING
        },
        "RETFIE":function(){
            //DO SOMETHING
        },
        "RETLW":function(k){
            //DO SOMETHING
        },
        "RETURN":function(){
            //DO SOMETHING
        },
        "SLEEP":function(){
            //DO SOMETHING
        },
        "SUBLW":function(k){
            //DO SOMETHING
        },
        "XORLW":function(k){
            //DO SOMETHING
        }
    };
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
