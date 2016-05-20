/**
 * Created by Alex on 02.05.2016.
 */
app.controller("AblaufsCtrl", function ($scope, DataPic, $timeout) {
    $scope.StopFlag = false;
    DataPic.Instructioncounter = 0;
    var testsequenzeline;
    var temp1, temp2;
    $scope.breakpointbox = false;
    $scope.breakpointview = true;
    $scope.ProgramCounter = [];
    $scope.watchdogflag = false;
    var watchflag = false;
    var trisflag = false;

    var runner;

    var firstrunFlag = true;

    $scope.runPic = function () {
        $scope.Startapp();
        $scope.checkWatchdog();
    };

    $scope.changeWatchdogState = function () {
        $scope.watchdogflag = !$scope.watchdogflag;
    };

    $scope.Startapp = function () {
        // Stopflag wird vom Stop BTN ausgelöst, daher bei einem Start auf false
        // Da dynamisch abgefragt, wird er sicherheitshalber nochmal auf false gesetzt
        $scope.StopFlag = false;
        // Beim ersten Start wird sicherheitshalber der Instructioncounter auf 0 gesetzt
        if (firstrunFlag == true) {
            DataPic.Instructioncounter = 0;
        }
        firstrunFlag = false;

        // Breakpoints nur bei dem automatischen Durchlauf gecheckt, daher außerhalb der oneStep fkt
        controlBreakPoint($scope.operations[DataPic.Instructioncounter].zeile);

        // Stop BTN kann manuell im Ablauf gedrückt werden, daher wird er vor jedem einzelnen Schritt überprüft
        if ($scope.StopFlag == false) {
            // Solange es keinen Sleep gibt, soll das Programm weiterlaufen
            // bei gesetztem Sleep wird nur auf Interrupts überprüft und Takte / Zeit erhöt
            if (DataPic.Sleepflag == false) {
                $scope.oneStep();
            } else {
                $scope.checkInterrupt();
                DataPic.Zeit(1);
                DataPic.IncTaktanzahl(1);
                // Timerimpulsberechnung setzt sich aus der Gesamtanzahl von den Takten und
                // der Prescalereinstellung zusammen
                if (DataPic.Taktanzahl % $scope.calculatePrescale() == 0 && DataPic.Taktanzahl >= 4) {
                    // incrementiert den TMR0
                    $scope.runTimer();
                }
                // Laufzeit wird extern abgelegt, damit sie von den anderen Controllern genutzt werden kann
                $scope.Laufzeit = DataPic.Laufzeit;
            }
        }

        // Angularspezifischer Ablauf, da Problem: Nur "While" ist zu schnell und die Seite lahmlegen würde
        runner = $timeout(function () {
            if ($scope.StopFlag == false) {
                $scope.Startapp();
            }
        }, 100 / DataPic.Takt); // Die Zahlenangabe verlangsamt und den Betrag die Ausführung der Schleife in [ms]

    };

    // Eigentliche Abarbeitung der Befehle
    $scope.oneStep = function () {
        // Wird für "Step Back" benötigt und speichert alle Zustände in einem Stack ab
        $scope.SaveStep();
        $scope.checkInterrupt();

        // Herzstück der Befehlsausführung mit der Übergabe der aktuellen Position im Programm als Hex
        $scope.callOperation($scope.operations[DataPic.Instructioncounter].befehl);

        // Wie zuvor TMR0 Incrementierung
        if (DataPic.Taktanzahl % $scope.calculatePrescale() == 0 && DataPic.Taktanzahl >= 4) {
            $scope.runTimer();
        }

        // Bei einem gesetztem Gotoflag wird der ProgrammCounter nicht erhöht
        if (DataPic.GotoFlag == 1) {
            DataPic.GotoFlag = 0;
        } else {
            DataPic.Instructioncounter++;
        }


        DataPic.AnzeigeIC++; //Angezeigter Operationszähler
        $scope.Laufzeit = DataPic.Laufzeit;
        $scope.Instructioncounter = DataPic.Instructioncounter;
    };

    $scope.reset = function () {
        $scope.resetPic();
    };

    $scope.stoppapp = function () {
        $scope.StopFlag = true;
    };

    $scope.SaveStep = function () {
        // Anlegen von temporären Variablen, die dann zur Faktory weitergegeben werden
        // Damit keine Scopeprobleme entstehen, müssen die Daten hier gespeichert werden
        var tempIC = DataPic.Instructioncounter;
        var tempram = [];
        for (var i = 0; i <= $scope.ram.length - 1; i++) {
            tempram[i] = $scope.ram[i];
        }
        var tempAIC = DataPic.AnzeigeIC;
        var tempW = $scope.w_reg;
        var tempDC = $scope.digitCarry;
        var tempC = $scope.carry;
        var tempZF = $scope.zeroFlag;
        var tempLZ = DataPic.Laufzeit;
        var tempWDT = DataPic.watchdogtimer;

        // Die Faktory enthällt die Speicherlogik und benötigt die ganzen Variablen dafür
        DataPic.SaveLastStep(tempIC, tempram, tempAIC, tempW, tempDC, tempC, tempZF, tempLZ, tempWDT);
    };

    // Dient zum hervorheben der Aktuellenzeile
    $scope.checkActive = function (line) {
        // Die aktuelle Zeile wird von der View Übergeben
        // Wenn die Zeile mit der Befehlszeile übereinstimmt wird die Classe "highlighted" hinzugefügt
        var vergleichsline = line.split(' ');
        return (vergleichsline[0] == $scope.operations[DataPic.Instructioncounter].zeile);
    };

    // Funktion zum Abprüfen ob eine BreakpointCheckbox angezeigt werden soll in der Zeile oder nicht
    $scope.checkBreakpoint = function (line) {
        return (/[0-9a-fA-F]{4}\s*[0-9a-fA-F]{4}/.test(line));
    };

    $scope.oneStepBack = function () {
        var lastState = DataPic.LastState[DataPic.LastState.length - 1];
        // Überschreibt die aktuellen Werte mit den alten
        $scope.rollBackState(lastState);
        // Refresh des anzeige PC
        $scope.Instructioncounter = DataPic.Instructioncounter;
        $scope.Laufzeit = DataPic.Laufzeit;
        DataPic.LastState.pop();

    };

    // Die angeklickte Zeile wird zum Breakpointarray hinzugefügt
    $scope.changeBreakPoint = function (BreakLine) {

        // Der Splitt Befehl teilt das einelementige Stringarray auf und macht statt einem Blank ein Komma
        var tempLine = BreakLine.split(' '); // ["0000 A024 ....."] ->["0000","A024",....]
        var breakLine = tempLine[0];
        var vorhandenFlag = false;

        // Überpüfung ob die angeklickte Zeile einen Breakpoint schon hat, wenn ja wird sie wieder gelöscht
        for (var i = 0; i <= DataPic.BreakPointArray.length - 1; i++) {
            if (breakLine == DataPic.BreakPointArray[i]) {
                DataPic.BreakPointArray.splice(i, 1); //["0000","0012","0A0F",...] -> (i=1): ["0000","0A0F",...]
                vorhandenFlag = true;
            }
        }
        if (vorhandenFlag == false) {
            DataPic.BreakPointArray.push(breakLine);
        }
    };

    // controlBreakPoint durchsucht das BreakpointArray, ob die aktuelle Zeile einen Breakpoint hat
    function controlBreakPoint(currentLine) {
        for (var i = 0; i <= DataPic.BreakPointArray.length - 1; i++) {
            if (currentLine == DataPic.BreakPointArray[i]) {
                // Wenn eins gefunden wird, stoppt es den Programmablauf
                $scope.stoppapp();
                break;
            }
        }
    }

    $scope.runTimer = function () {
        // Auslesen von der RAM[1] Zelle (TMR0)
        var tempTMR0 = parseInt($scope.ram[1], 16);

        // Wenn der TMR den Maximalwert erreicht hat muss dieser zurückgesetzt werden
        // und im INCTON das 2. Bit gesetzt
        if (tempTMR0 == 255) {
            var tempIntcon = parseInt($scope.ram[11], 16);
            var IntconArray = [];

            //Das INTCON wird hier von einer Int Zahl zu einem Bitarray umgewandelt
            for (var i = 0; i < 8; i++) {
                IntconArray[i] = (tempIntcon >> i) & 1;
            }
            // Das INTCON[2] ist das T0IF, dies wird beim überlauf gesetzt
            IntconArray[2] = 1;

            // Das temporäre INTCON Array muss jetzt wieder zusammengesetzt werden und im Ram gespeichert
            var FinalIntcon = "";
            FinalIntcon = IntconArray[7].toString() + IntconArray[6].toString()
                + IntconArray[5].toString() + IntconArray[4].toString()
                + IntconArray[3].toString() + IntconArray[2].toString()
                + IntconArray[1].toString() + IntconArray[0].toString();
            // Das FinalIntcon ist ein Bitstring und wird in eine Integerzahl umgewandelt,
            // da keine direkte Hexumwandlung möglich ist
            FinalIntcon = parseInt(FinalIntcon, 2);
            FinalIntcon = FinalIntcon.toString(16);
            $scope.ram[11] = FinalIntcon;

            // Das T0IF ist eine Hilfsvariable für die Interruptsteuerung
            $scope.T0IF = 1;

            // tempTMR0 wird resettet und als Hex ins ram[1] (TMR0) geschrieben
            tempTMR0 = 0;
            $scope.ram[1] = tempTMR0.toString(16);

        } else {
            // Ansonsten: Erhöhe TMR0 und speichere es im RAM
            tempTMR0++;
            $scope.ram[1] = tempTMR0.toString(16);
        }
    };

    $scope.checkInterrupt = function () {
        // Der Interrupt kann nur aus 3 Quellen Stammen: TMR0 Interrupt, RB0 Interrupt und RB4-7
        if (($scope.T0IE && $scope.T0IF && $scope.GIE) ||
            ($scope.INTE && $scope.RB0InterruptFlag && $scope.GIE) ||
            ($scope.RBIE && $scope.RBIF && $scope.GIE)) {
            DataPic.Sleepflag = false;
            // Vorm Interrupt muss das GIE Bit gelöscht
            $scope.ram[11] = (parseInt($scope.ram[11], 16) & parseInt("01111111", 2)).toString(16);

            // Der aktuelle Programcounter wird in den Stack geladen
            DataPic.ProgramStack.push(DataPic.Instructioncounter);
            $scope.ProgramStack = DataPic.ProgramStack;
            // Die Interruptaddresse ist 4h, daher kann es hardcoded reingeschrieben werden
            DataPic.Instructioncounter = 4;
        }

    };

    $scope.checkWatchdog = function () {
        // watchdogflag kommt von der View
        // Es gibt nut einen Watchdog, wenn dieser auf der View Angeklickt wurde
        if ($scope.watchdogflag == true) {
            $scope.incrementWatchdog();
        }

        runner = $timeout(function () {
            if ($scope.watchdogflag == true) {
                $scope.checkWatchdog();
            }
        }, 1000 / DataPic.Takt); //Damit keine Echten Millisekunden, da es zu schnell für die Webanwendung wäre
    };
    $scope.incrementWatchdog = function () {
        //Der Watchdogtimer im PIC hat per default eine länge von 18ms, diese wird mit dem prescaler verrechnet
        if (DataPic.watchdogtimer <= 18 * $scope.watchdogPrescale()) {
            DataPic.watchdogtimer++;
        } else {
            // Wenn es zu einem Überlauf kommt und sleep wurde ausgewählt: weckt der WDT den PIC wieder
            if (DataPic.Sleepflag == true) {
                DataPic.Sleepflag = false;
                DataPic.Instructioncounter++;
                //$scope.watchdogflag=false;
                DataPic.GotoFlag = 1;
            } else {
                $scope.reset();
            }
        }
    };

    // $watch Funktion ermöglicht Änderungen an der Zielvariable dynamisch zu erkennen
    // -> Ermöglicht "echte" Reaktionszeiten
    // Ram[6] => PortB für Interrupt wichtig
    $scope.$watch('ram[6]', function (newValue, oldValue) {

        // Test ob RP0 Bit gesetzt (Bankumschaltung) Problem: Endlosrekursion
        // Lösung: watchflag verhindert Rekursion
        if (((parseInt($scope.ram[3], 16) & parseInt('00100000', 2)) == 32) && (watchflag)) {
            //Register 134d = 86h -> TrisB
            if (newValue != 0) {
                $scope.ram[134] = newValue;
            }
            $scope.ram[6] = parseInt(oldValue, 16) & parseInt(newValue, 16);
            watchflag = false;

            // Verhindert verfälschung bei Interruptsetzungen
            trisflag = true;
            return;

        } else {
            // Tests ob es Interrupts gibt, die mit dem PortB zusammenhängen -> Interruptbits setzten
            // INTEDG bestimmt die Flankenrichtung beim RB0 Interrupt: Gesetzt Steigende Flanke, sonst Fallende
            if (((parseInt($scope.ram[81], 16) & parseInt("01000000", 2)) == 62) && (!trisflag)) {
                // Test auf steigende Flanke 0 -> 1
                if (((parseInt(oldValue, 16) & parseInt("00000001", 2)) == 0) &&
                    ((parseInt(newValue, 16) & parseInt("00000001", 2)) == 1)) {
                    $scope.RB0InterruptFlag = 1;
                    // Interruptflags werden ins INTCON geschrieben
                    $scope.ram[11] = (parseInt("10010010", 2)).toString(16);
                    watchflag = true;
                    // Es kann immer nur ein Fall auftreten, daher müssen die restlichen dann nicht überprüft werden
                    return;
                } else {
                    $scope.RB0InterruptFlag = 0;
                }
            } else {
                // Test auf fallende Flanke: 1 -> 0
                if (((parseInt(oldValue, 16) & parseInt("00000001", 2)) == 1) &&
                    ((parseInt(newValue, 16) & parseInt("00000001", 2)) == 0) && (!trisflag)) {
                    $scope.RB0InterruptFlag = 1;
                    $scope.ram[11] = (parseInt("10010010", 2)).toString(16);
                    watchflag = true;
                    return;
                } else {
                    $scope.RB0InterruptFlag = 0;
                }
            }
            // RB4-7 Interrupt Test : Da die Bits 4-7 Sind reicht die Abfrage auf >15
            if (((parseInt($scope.ram[6], 16) > 15)) && (!trisflag)) {
                $scope.RBIF = 1;
                $scope.ram[11] = (parseInt("10001001", 2)).toString(16);
                watchflag = true;
                return;
            } else {
                $scope.RBIF = 0;
            }
        }
        trisflag = false;
    });

    // GIE und T0IE Watcher meldet jede änderung am ram[11] und check ob die bedingungen erfult wurden
    // Dieser Watcher aktuallisiert nur die Interruptbits für den checkInterrupt()
    $scope.$watch('ram[11]', function () {
        if ((parseInt($scope.ram[11], 16) & parseInt("10000000", 2)) == 128) {
            $scope.GIE = 1;
        } else {
            $scope.GIE = 0;
        }
        if ((parseInt($scope.ram[11], 16) & parseInt("00100000", 2)) == 32) {
            $scope.T0IE = 1;
        } else {
            $scope.T0IE = 0;
        }
        if ((parseInt($scope.ram[11], 16) & parseInt("00010000", 2)) == 16) {
            $scope.INTE = 1;
        } else {
            $scope.INTE = 0;
        }
        if ((parseInt($scope.ram[11], 16) & parseInt("00001000", 2)) == 8) {
            $scope.RBIE = 1;
        } else {
            $scope.RBIE = 0;
        }

    });
});