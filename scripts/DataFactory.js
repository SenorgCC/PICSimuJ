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
    
    PicData.Takt=0;
    PicData.Laufzeit=0;

    PicData.ram=[];

    PicData.Zeit = function (takte) {
        PicData.Laufzeit= PicData.Laufzeit + (1/PicData.Takt)* takte;
        alert(PicData.Laufzeit);
        ///TODO: Alert entfernen
    };


    return PicData;

});