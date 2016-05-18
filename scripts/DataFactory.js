/**
 * Created by Alex on 07.05.2016.
 */
app.factory('DataPic',function () {
    // Eine Factory sollte ein Objekt zurückliefern, dieses objekt kann mit dem "." - operater verschiedene Daten enthalten
    var PicData={};
    // Der Instructioncounter wird in mehreren CTRL und Funktionen benötigt
    // damit er überall synchron bleibt, wird er in eine Faktory ausgelagert. Diese ermöglicht eine Synchronität
    // der Variable
    PicData.Instructioncounter=0;
    // Ein Goto manipuliert den Instructioncounter, falls der Goto Befehl ausgeführt wird,
    // ermöglicht das Flag eine entsprechende Anpassung der Ausführungsloop
    PicData.GotoFlag=0;

    //Last State enthällt die Variablen und Registerergebnise des vorherigen Schrittes
    //Diese Array Arbeitet als ein Stack, damit mehrere Schritte rückgängig gemacht werden können
    PicData.LastState = [];
    
    //Initialisierung der Variablen für Takt und Laufzeit
    PicData.Takt=0;
    PicData.Taktanzahl=0;
    PicData.Laufzeit=0;

    PicData.zeroFlag=0;
    PicData.digitCarry=0;
    PicData.carry=0;
    PicData.AnzeigeIC=0;
    PicData.ProgramStack =[];
    PicData.BreakPointArray=[];

    PicData.watchdogtimer=0;

    //Interruptflags

    PicData.GIE=0;
    PicData.T0IF=0;
    PicData.T0IE=0;
    PicData.Sleepflag=false;
    

    //Berechnung der Laufzeitanzeige Übergabe sind die benötigten Takte eines Befehls
    PicData.Zeit = function (takte) {
        PicData.Laufzeit= PicData.Laufzeit + (1/PicData.Takt)* takte;
    };

    PicData.SaveLastStep = function (IC,Ram,AIC,WREG,DC,C,ZF,LZ) {
        PicData.LastState.push({
            InstructionCounter: IC,
            ram: Ram,
            AnzeigeIC: AIC,
            w_reg: WREG,
            digitCarry: DC,
            carry: C,
            zeroFlag: ZF,
            laufzeit: LZ
        });
    };

    PicData.IncTaktanzahl = function (taktZahl){
        PicData.Taktanzahl = PicData.Taktanzahl + taktZahl;
    };


    return PicData;

});