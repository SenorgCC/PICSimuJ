app.controller('CPU', function ($scope, DataPic) {

    function getDirectory(binOP) {
        //Das D-Bit befindet sich bei den meisten Befehlen an der Selben Position, daher kann es ausmaskiert werden
        var directory = parseInt(binOP, 2) & parseInt('00000010000000', 2);
        //Die ">>" Bewirken einen Rotate right um eine Anzahl von Stellen
        //Da das Directory Bit sich an der 8. Stelle befindet muss es um 7 Stellen rotiert werden
        //Dies vereinfacht die weitere Verarbeitung, da es nur noch auf "1" überprüft werden muss
        directory = directory >> 7;
        return directory;
    }

    function getFileregister(binOP) {
        //Die File-Bits werden bei diesem Befehl ausmaskiert
        //JS macht bei einer Verundung von von Strings probleme
        //daher müssen diese zuerst in einen Integer gecastet werden
        var file = parseInt(binOP, 2) & parseInt('00000001111111', 2);
        return file;
    }

    function getbitAddress(binOP) {
        //Selbiges Prinzip wie bei getFileregister und getDirectory
        //zum einfacheren Verarbeiten wird das ergebnis um 7 stellen nach rechts rotiert
        var bitAddress = parseInt(binOP, 2) & parseInt('00001110000000', 2);
        bitAddress = bitAddress >> 7;
        return bitAddress;
    }

    function getLiteralfieldshort(binOP) {
        //Einfache Maskierung, wie bei den anderen Befehlen
        //Desweiteren gibt es hier 2 Literalmaskierungsfunktionen, da es befehle gibt zu 11 statt 7 Bit liefern
        var literalfield = parseInt(binOP, 2) & parseInt('00000011111111', 2);
        return literalfield;
    }

    function getLiteralfieldlong(binOP) {
        //Die Befehle GOTO und CALL benötigen ein 11 Bit Literal, statt einem 7 Bit großen
        var literalfield = parseInt(binOP, 2) & parseInt('00011111111111', 2);
        return literalfield;
    }

    function getBinaryArray(hexVal) {

        //Sowohl der Inhalt des W Registers als auch des File Registers sind in Hex kodiert
        //Die meisten Funktionen benötigen aber bitweise operationen -> Umwandlungsfunktion, liefert ein Bitarray
        var tempHex_Val = parseInt(hexVal, 16);
        var result_Binary = [];
        // Der Rotationsbefehl verändert dieIntegerzahl bitweise
        // diese Verschiebung kann zur Umwandlung in ein bitarray genutzt werden
        for (var i = 0; i < 8; i++) {
            result_Binary[i] = (tempHex_Val >> i) & 1;
        }
        return result_Binary;

    }
    function getCallArray(hexVal) {

        //Sowohl der Inhalt des W Registers als auch des File Registers sind in Hex kodiert
        //Die meisten Funktionen benötigen aber bitweise operationen -> Umwandlungsfunktion, liefert ein Bitarray
        var tempHex_Val = parseInt(hexVal, 16);
        var result_Binary = [];
        // Der Rotationsbefehl verändert dieIntegerzahl bitweise
        // diese Verschiebung kann zur Umwandlung in ein bitarray genutzt werden
        for (var i = 0; i < 11; i++) {
            result_Binary[i] = (tempHex_Val >> i) & 1;
        }
        return result_Binary;

    }

    function getBinaryLiteralArray(IntVal) {

        //Das k Literalfeld wird mit 11 Bit Kodiert der Programmcounter Benötigt 13
        //diese 11 werden in einem BinArray gespeichert
        var result_Binary = [];

        for (var i = 0; i < 11; i++) {
            result_Binary[i] = (IntVal >> i) & 1;
        }
        return result_Binary;

    }

    function convertArrayToHex(BinArray) {
        //Um eine Korrekte Umwandlung von einem Binär Array zu einem Hex wert zu ermöglichen
        //wird das übergebene Bit Array Bitweise zusammengesetzt und im Anschluss konvertiert
        //Diese Funktion umgeht das MSB und LSB problem zwischen JS und der Ausgabe
        var result = "";
        result = BinArray[7].toString() + BinArray[6].toString()
            + BinArray[5].toString() + BinArray[4].toString()
            + BinArray[3].toString() + BinArray[2].toString()
            + BinArray[1].toString() + BinArray[0].toString();
        result = parseInt(result, 2);
        result = result.toString(16);
        return result;
    }

    function getComArray(binArray) {
        // Diese Funktion Wandelt das eingegebene binär Array in das ensprechende komplimentäre array um und gibt es aus
        var complement = new Array();

        // Da nur 8 Bit Werte übergeben werden reicht eine abfrage bis 8
        for (var i = 0; i < 8; i++) {
            if (binArray[i] == 0) {
                complement[i] = 1;
            } else {
                complement[i] = 0;
            }
        }
        return complement;

    }

    function getZweierKomplement(hexValue) {
        // Das Zweierkomplement wird durch die Negation der Binär zahl und anschließender Addition von 1 errechnet
        // Da die Werte als Hex gespeichert werden müssen diese umgewandelt werden
        var zweierKompResult = getBinaryArray(hexValue);

        // Wandelt das Bitarray in ihr Komplement um
        zweierKompResult = getComArray(zweierKompResult);

        // Es können keine arithmetischen Operationen mit einem Bitarray dsurchgeführt werden, die Bitarray to Hex
        // Funktion erleichtert die Konvertierung
        zweierKompResult = convertArrayToHex(zweierKompResult);

        //Zweierkomplement = Komplement + 1 -> Da die komplement Zahl als Hex vorliegt, kann die parseInt funktion es umwandeln
        zweierKompResult = parseInt(zweierKompResult, 16) + 1;
        return zweierKompResult;
    }

    function setCarry() {
        var tempStatus = getBinaryArray($scope.ram[3]);
        tempStatus[0] = 1;
        $scope.carry = 1;
        $scope.ram[3] = convertArrayToHex(tempStatus);

    }

    function clrCarry() {
        var tempStatus = getBinaryArray($scope.ram[3]);
        tempStatus[0] = 0;
        $scope.carry = 0;
        $scope.ram[3] = convertArrayToHex(tempStatus);
    }

    function setDigitCarry() {
        var tempStatus = getBinaryArray($scope.ram[3]);
        tempStatus[1] = 1;
        $scope.digitCarry = 1;
        $scope.ram[3] = convertArrayToHex(tempStatus);

    }

    function clrDigitCarry() {
        var tempStatus = getBinaryArray($scope.ram[3]);
        tempStatus[1] = 0;
        $scope.digitCarry = 0;
        $scope.ram[3] = convertArrayToHex(tempStatus);

    }

    function setZeroFlag() {
        var tempStatus = getBinaryArray($scope.ram[3]);
        tempStatus[2] = 1;
        $scope.zeroFlag = 1;
        $scope.ram[3] = convertArrayToHex(tempStatus);
    }

    function clrZeroFlag() {
        var tempStatus = getBinaryArray($scope.ram[3]);
        tempStatus[2] = 0;
        $scope.zeroFlag = 0;
        $scope.ram[3] = convertArrayToHex(tempStatus);
    }


    $scope.callOperation = function (hexOP) {
        // Die callOperation Funktion ist die Kernfunktion der CPU
        // Sie Sucht nach dem Richtigen Befehl, der als Hex Wert übergeben wird
        // Durch Maskierung werden die Variablenwerte aus dem übergebenem Hexwert rausgefiltert

        var temp = parseInt(hexOP, 16);
        var tempbin = temp.toString(2);

        // abfrage auf den Befehl anführende "00" werden leider ausgeschnitten und js kann nativ kein binary
        // Durch binäre Verknüpfung wird der Richtige Befehl gefiltert, da jeder Befehl durch
        // eine einmalige Bitfolge dargestellt wird
        // manche Befehle Enthalten Don't care Zustände diese können statt einzeln auszustesten
        // durch die Intergerzahl Darstellung zusammengefasst werden


        if ((parseInt(tempbin, 2) & parseInt('11111100000000', 2)).toString(2) == "11100000000") {
            //Befehl ADDWF
            Befehlsausfuehrung["ADDWF"](getFileregister(tempbin), getDirectory(tempbin));

        } else if ((parseInt(tempbin, 2) & parseInt('11111100000000', 2)).toString(2) == "10100000000") {
            //ANDWF
            Befehlsausfuehrung["ANDWF"](getFileregister(tempbin), getDirectory(tempbin));

        } else if ((parseInt(tempbin, 2) & parseInt('11111110000000', 2)).toString(2) == "110000000") {
            //CLRF
            Befehlsausfuehrung["CLRF"](getFileregister(tempbin), getDirectory(tempbin));

        } else if (((parseInt(tempbin, 2) & parseInt('11111110000000', 2)) > 255) & ((parseInt(tempbin, 2) & parseInt('11111110000000', 2)) < 384)) {
            //CLRW
            Befehlsausfuehrung["CLRW"]();

        } else if ((parseInt(tempbin, 2) & parseInt('11111100000000', 2)).toString(2) == "100100000000") {
            //COMF
            Befehlsausfuehrung["COMF"](getFileregister(tempbin), getDirectory(tempbin));

        } else if ((parseInt(tempbin, 2) & parseInt('11111100000000', 2)).toString(2) == "1100000000") {
            //DECF
            Befehlsausfuehrung["DECF"](getFileregister(tempbin), getDirectory(tempbin));

        } else if ((parseInt(tempbin, 2) & parseInt('11111100000000', 2)).toString(2) == "101100000000") {
            //DECFSZ
            Befehlsausfuehrung["DECFSZ"](getFileregister(tempbin), getDirectory(tempbin));

        } else if ((parseInt(tempbin, 2) & parseInt('11111100000000', 2)).toString(2) == "101000000000") {
            //INCF
            Befehlsausfuehrung["INCF"](getFileregister(tempbin), getDirectory(tempbin));

        } else if ((parseInt(tempbin, 2) & parseInt('11111100000000', 2)).toString(2) == "111100000000") {
            //INCFSZ
            Befehlsausfuehrung["INCFSZ"](getFileregister(tempbin), getDirectory(tempbin));

        } else if ((parseInt(tempbin, 2) & parseInt('11111100000000', 2)).toString(2) == "10000000000") {
            //IORWF
            Befehlsausfuehrung["IORWF"](getFileregister(tempbin), getDirectory(tempbin));

        } else if ((parseInt(tempbin, 2) & parseInt('11111100000000', 2)).toString(2) == "100000000000") {
            //MOVF
            Befehlsausfuehrung["MOVF"](getFileregister(tempbin), getDirectory(tempbin));
        } else if ((parseInt(tempbin, 2) & parseInt('11111110000000', 2)).toString(2) == "10000000") {
            //MOVWF
            Befehlsausfuehrung["MOVWF"](getFileregister(tempbin));

        } else if (((parseInt(tempbin, 2) & parseInt('11111111111111', 2)).toString(2) == "0")
            | ((parseInt(tempbin, 2) & parseInt('11111111111111', 2)).toString(2) == "100000")
            | ((parseInt(tempbin, 2) & parseInt('11111111111111', 2)).toString(2) == "1000000")
            | ((parseInt(tempbin, 2) & parseInt('11111111111111', 2)).toString(2) == "1100000")) {
            //NOP
            Befehlsausfuehrung["NOP"]();

        } else if ((parseInt(tempbin, 2) & parseInt('11111100000000', 2)).toString(2) == "110100000000") {
            //RLF
            Befehlsausfuehrung["RLF"](getFileregister(tempbin), getDirectory(tempbin));

        } else if ((parseInt(tempbin, 2) & parseInt('11111100000000', 2)).toString(2) == "110000000000") {
            //RRF
            Befehlsausfuehrung["RRF"](getFileregister(tempbin), getDirectory(tempbin));

        } else if ((parseInt(tempbin, 2) & parseInt('11111100000000', 2)).toString(2) == "1000000000") {
            //SUBWF
            Befehlsausfuehrung["SUBWF"](getFileregister(tempbin), getDirectory(tempbin));

        } else if ((parseInt(tempbin, 2) & parseInt('11111100000000', 2)).toString(2) == "111000000000") {
            //SWAPF
            Befehlsausfuehrung["SWAPF"](getFileregister(tempbin), getDirectory(tempbin));

        } else if ((parseInt(tempbin, 2) & parseInt('11111100000000', 2)).toString(2) == "11000000000") {
            //XORWF
            Befehlsausfuehrung["XORWF"](getFileregister(tempbin), getDirectory(tempbin));

        } else if ((parseInt(tempbin, 2) & parseInt('11110000000000', 2)).toString(2) == "1000000000000") {

            //BCF
            Befehlsausfuehrung["BCF"](getFileregister(tempbin), getbitAddress(tempbin));

        } else if ((parseInt(tempbin, 2) & parseInt('11110000000000', 2)).toString(2) == "1010000000000") {
            //BSF
            Befehlsausfuehrung["BSF"](getFileregister(tempbin), getbitAddress(tempbin));

        } else if ((parseInt(tempbin, 2) & parseInt('11110000000000', 2)).toString(2) == "1100000000000") {
            //call Befehel: BTFSC
            Befehlsausfuehrung["BTFSC"](getFileregister(tempbin), getbitAddress(tempbin));

        } else if ((parseInt(tempbin, 2) & parseInt('11110000000000', 2)).toString(2) == "1110000000000") {

            //call Befehl: BTFSS
            Befehlsausfuehrung["BTFSS"](getFileregister(tempbin), getbitAddress(tempbin));

        } else if (((parseInt(tempbin, 2) & parseInt('11111100000000', 2)).toString(2) == "11111000000000")
            | (parseInt(tempbin, 2) & parseInt('11111100000000', 2)).toString(2) == "11111100000000") {
            //ADDLW
            Befehlsausfuehrung["ADDLW"](getLiteralfieldshort(tempbin));

        } else if ((parseInt(tempbin, 2) & parseInt('11111100000000', 2)).toString(2) == "11100100000000") {
            //ANDLW
            Befehlsausfuehrung["ANDLW"](getLiteralfieldshort(tempbin));

        } else if ((parseInt(tempbin, 2) & parseInt('11100000000000', 2)).toString(2) == "10000000000000") {
            //CALL
            Befehlsausfuehrung["CALL"](getLiteralfieldlong(tempbin));

        } else if ((parseInt(tempbin, 2) & parseInt('11111111111111', 2)).toString(2) == "1100100") {
            //CLRWDT
            Befehlsausfuehrung["CLRWDT"]();

        } else if ((parseInt(tempbin, 2) & parseInt('11100000000000', 2)).toString(2) == "10100000000000") {
            //GOTO
            Befehlsausfuehrung["GOTO"](getLiteralfieldlong(tempbin));

        } else if ((parseInt(tempbin, 2) & parseInt('11111100000000', 2)).toString(2) == "11100000000000") {
            //IORLW
            Befehlsausfuehrung["IORLW"](getLiteralfieldshort(tempbin));

        } else if (((parseInt(tempbin, 2) & parseInt('11111100000000', 2)).toString(2) == "11000000000000")
            | ((parseInt(tempbin, 2) & parseInt('11111100000000', 2)).toString(2) == "11000100000000")
            | ((parseInt(tempbin, 2) & parseInt('11111100000000', 2)).toString(2) == "11001000000000")
            | ((parseInt(tempbin, 2) & parseInt('11111100000000', 2)).toString(2) == "11001100000000")) {

            //MOVLW
            Befehlsausfuehrung["MOVLW"](getLiteralfieldshort(tempbin));

        } else if ((parseInt(tempbin, 2) & parseInt('11111111111111', 2)).toString(2) == "1001") {
            //RETFIE
            Befehlsausfuehrung["RETFIE"]();

        } else if (((parseInt(tempbin, 2) & parseInt('11111100000000', 2)).toString(2) == "11010000000000")
            | ((parseInt(tempbin, 2) & parseInt('11111100000000', 2)).toString(2) == "11010100000000")
            | ((parseInt(tempbin, 2) & parseInt('11111100000000', 2)).toString(2) == "11011000000000")
            | ((parseInt(tempbin, 2) & parseInt('11111100000000', 2)).toString(2) == "11011100000000")) {

            //RETLW
            Befehlsausfuehrung["RETLW"](getLiteralfieldshort(tempbin));

        } else if ((parseInt(tempbin, 2) & parseInt('11111111111111', 2)).toString(2) == "1000") {
            //RETURN
            Befehlsausfuehrung["RETURN"]();

        } else if ((parseInt(tempbin, 2) & parseInt('11111111111111', 2)).toString(2) == "1100011") {
            //SLEEP
            Befehlsausfuehrung["SLEEP"]();

        } else if (((parseInt(tempbin, 2) & parseInt('11111100000000', 2)).toString(2) == "11110000000000")
            | ((parseInt(tempbin, 2) & parseInt('11111100000000', 2)).toString(2) == "11110100000000")) {

            //SUBLW
            Befehlsausfuehrung["SUBLW"](getLiteralfieldshort(tempbin));

        } else if ((parseInt(tempbin, 2) & parseInt('11111100000000', 2)).toString(2) == "11101000000000") {
            //XORLW
            Befehlsausfuehrung["XORLW"](getLiteralfieldshort(tempbin));
        }
    };

    // Statt alle PIC Befehle in einzelne Funktionen zu verpacken, haben wir uns für eine Lookup Table entschieden,
    // der Aufruf sieht wie folgt aus : Befehlsausfuehrung[Bezeichner](Parameter)
    // die Lookuptable ist somit übersichtlicher als die einzelnen Funktionen
    var Befehlsausfuehrung = {
        "ADDWF": function (f, d) {
            // Beim ADDWF Befehl wird ein Register mit dem Arbeitsregister addiert
            // und die Summe bei gesetztem d Bit im Ram und nicht gesetztem im Arbeitsregister abgespeichert.
            // Da dieser Befehl das DC carry manipulieren wird ein temporäre Kopie des Alten Arbeitsregisters benötigt.
            // Die Daten werden sowohl im Arbeitsregister als auch im Fileregister in in Hexdarstellung
            // und damit als String variablen gespeichert.
            // Aus diesem Grund müssen diese vor der eigentlichen Bearbeitung in einen Integerwert geparst werden.
            var tempW_Reg = parseInt($scope.w_reg, 16);

            var addresult = tempW_Reg + parseInt($scope.ram[f], 16);

            // Dieser Befehl könnte auch an die initialisierung angehängt werden,
            // doch für eine bessere Lesbarkeit wurden diese Befehle getrennt
            addresult = addresult.toString(16);

            // Da Javascript keine Konvertierung von Integer auf binär Array kann,
            // erfüllt diese Funktion die Aufgabe. Rückgabewert ist ein Bitarray
            var tempW_RegArray = getBinaryArray($scope.w_reg);
            var tempaddresult_Array = getBinaryArray(addresult);

            // Für die Überprüfung des Digitcarrys werden die unteren Nibble des vorherigen Arbeitsregisters
            // und der Wert des Arbeitsregisters nach dem Befehl benötigt.
            var wReg_firstN, addresresult_FirstN;

            // Die Nibbles können durch einfaches konkadenieren von den Arrayemelenten gebildet werden
            wReg_firstN = tempW_RegArray[4].toString()
                + tempW_RegArray[3].toString()
                + tempW_RegArray[2].toString()
                + tempW_RegArray[1].toString()
                + tempW_RegArray[0].toString();

            addresresult_FirstN = tempaddresult_Array[4].toString()
                + tempaddresult_Array[3].toString()
                + tempaddresult_Array[2].toString()
                + tempaddresult_Array[1].toString()
                + tempaddresult_Array[0].toString();

            // Das Carrybit ist der überlauf vom 7. Bit und wird durch ein Ergebnis größer gleich 256 (2^8) ausgelöst
            // Das Carrybit wird gesetzt und der Überlauf, durch die Subtraktion von 256, abgeschnitten
            // Bei zwei 8 Bit registern ist die Höstmögliche Zahl (FF+FF) = 1FE und damit nicht größer als das 8. Bit
            if (parseInt(addresult, 16) > 255) {

                var temp = parseInt(addresult, 16);
                setCarry();
                temp = temp - 256;
                addresult = temp.toString(16);
            } else {
                clrCarry();
            }

            // Zeroflag Überprüfung
            if (parseInt(addresult, 16) == 0) {
                setZeroFlag();
            } else {
                clrZeroFlag();
            }
            // Beim DigitCarry übertrag muss das der vorherige Arbeitsregisterwert kleiner 15 und
            // nach der Rechnung größer 15 sein
            if ((parseInt(wReg_firstN, 2) < 16) && (parseInt(addresresult_FirstN, 2) > 15)) {
                setDigitCarry();
            } else {
            }
            clrDigitCarry();

            if (d == 1) {

                $scope.ram[f] = addresult;
            } else {
                $scope.w_reg = addresult;
            }
            if(f==2) {
                changeProgramCounter();
            }
            // Die Laufzeitberechnungsfunktion liegt in der Factory DataPic, damit es scopeübergreifend
            // den selben Wert speichern kann
            DataPic.Zeit(1);
            DataPic.IncTaktanzahl(1);

        },
        "ANDWF": function (f, d) {

            var fileRegValue = $scope.ram[f];
            var andresult = ((parseInt($scope.w_reg, 16)) & (parseInt(fileRegValue, 16)));
            andresult = andresult.toString(16);

            if (parseInt(andresult, 16) == 0) {
                setZeroFlag();
            } else {
                clrZeroFlag();
            }

            if (d == 1) {

                $scope.ram[f] = andresult;
            } else {
                $scope.w_reg = andresult;
            }
            DataPic.Zeit(1);
            DataPic.IncTaktanzahl(1);
        },
        "CLRF": function (f) {
            $scope.ram[f] = '00';
            setZeroFlag();

            DataPic.Zeit(1);
            DataPic.IncTaktanzahl(1);
        },
        "CLRW": function () {
            $scope.w_reg = '00';
            setZeroFlag();
            DataPic.Zeit(1);
            DataPic.IncTaktanzahl(1);
        },
        "COMF": function (f, d) {
            var tempcomresult = getBinaryArray($scope.ram[f]);
            var comresult = getComArray(tempcomresult);
            comresult = convertArrayToHex(comresult);
            if (parseInt(comresult, 16) == 0) {
                setZeroFlag();
            } else {
                clrZeroFlag();
            }
            if (d == 1) {

                $scope.ram[f] = comresult;
            } else {
                $scope.w_reg = comresult;
            }
            DataPic.Zeit(1);
            DataPic.IncTaktanzahl(1);
        },
        "DECF": function (f, d) {
            //DO SOMETHING
            var result = parseInt($scope.ram[f], 16);
            if (result > 0) {
                result--;
            } else {
                result = 255; //result=ff
            }
            if (result == 0) {
                setZeroFlag();
            } else {
                clrZeroFlag();
            }
            result = result.toString(16);

            if (d == 1) {
                $scope.ram[f] = result;
            } else {
                $scope.w_reg = result;
            }
            DataPic.Zeit(1);
            DataPic.IncTaktanzahl(1);
        },
        "DECFSZ": function (f, d) {
            var result = parseInt($scope.ram[f], 16);
            if (result > 0) {
                result--;
            } else {
                result = 0;
            }
            //Wenn das register um 1 dekrementiert wird und damit 0 ergibt,
            //wird statt dem nächsten Befehl ein NOP ausgeführt
            if (result == 0) {
                DataPic.Instructioncounter++;
                DataPic.Zeit(2);
                DataPic.IncTaktanzahl(2);
            } else {
                DataPic.Zeit(1);
                DataPic.IncTaktanzahl(1);
            }
            result = result.toString(16);
            if (d == 1) {
                $scope.ram[f] = result;
            } else {
                $scope.w_reg = result;
            }

        },
        "INCF": function (f, d) {
            var result = parseInt($scope.ram[f], 16);
            if (result < 255) {
                result++;
            } else {
                result = 0;
            }
            result = result.toString(16);

            if (d == 1) {
                $scope.ram[f] = result;
            } else {
                $scope.w_reg = result;
            }

            if (result == 0) {
                setZeroFlag();
            } else {
                clrZeroFlag();
            }
            DataPic.Zeit(1);
            DataPic.IncTaktanzahl(1);
        },
        "INCFSZ": function (f, d) {
            var result = parseInt($scope.ram[f], 16);
            if (result < 255) {
                result++;
            } else {
                result = 0;
            }
            //Wenn das register um 1 dekrementiert wird und damit 0 ergibt,
            //wird statt dem nächsten Befehl ein NOP ausgeführt
            if (result == 0) {
                DataPic.Instructioncounter++;
                DataPic.Zeit(2);
                DataPic.IncTaktanzahl(2);
            } else {
                DataPic.Zeit(1);
                DataPic.IncTaktanzahl(1);
            }
            result = result.toString(16);
            if (d == 1) {
                $scope.ram[f] = result;
            } else {
                $scope.w_reg = result;
            }
        },
        "IORWF": function (f, d) {
            var fileRegValue = $scope.ram[f];
            var andresult = ((parseInt($scope.w_reg, 16)) | (parseInt(fileRegValue, 16)));
            andresult = andresult.toString(16);

            if (parseInt(andresult, 16) == 0) {
                setZeroFlag();
            } else {
                clrZeroFlag();
            }

            if (d == 1) {

                $scope.ram[f] = andresult;
            } else {
                $scope.w_reg = andresult;
            }
            DataPic.Zeit(1);
            DataPic.IncTaktanzahl(1);
        },
        "MOVF": function (f, d) {
            var movffile = $scope.ram[f];
            if (movffile == 0) {
                setZeroFlag();
            }
            if (d == 1) {
                $scope.ram[f] = movffile;
            } else {
                $scope.w_reg = movffile;
            }
            DataPic.Zeit(1);
            DataPic.IncTaktanzahl(1);
        },
        "MOVWF": function (f) {
            $scope.ram[f] = $scope.w_reg;
            DataPic.Zeit(1);
            DataPic.IncTaktanzahl(1);
            if(f==2) {
                changeProgramCounter();
            }
        },
        "NOP": function () {
            //Der NOP Befehl erhöt nur den IC, Keine weitere Funktion
            //$scope.Instructioncounter++;
            DataPic.Zeit(1);
            DataPic.IncTaktanzahl(1);
        },
        "RLF": function (f, d) {
            var rlfresult = new Array();
            var oldfile = getBinaryArray($scope.ram[f]);
            var tempStatus = getBinaryArray($scope.ram[3]);
            var tempCarry = tempStatus[0];

            $scope.carry = oldfile[7];
            tempStatus[0] = oldfile[7];
            $scope.ram[3] = convertArrayToHex(tempStatus);

            for (var i = 7; i >= 0; i--) {
                if (i == 0) {
                    rlfresult[i] = tempCarry;
                } else {
                    rlfresult[i] = oldfile[i - 1];
                }
            }

            rlfresult = convertArrayToHex(rlfresult);
            if (d == 1) {
                $scope.ram[f] = rlfresult;
            } else {
                $scope.w_reg = rlfresult;
            }
            DataPic.Zeit(1);
            DataPic.IncTaktanzahl(1);
        },
        "RRF": function (f, d) {
            var rrfresult = new Array();
            var oldfile = getBinaryArray($scope.ram[f]);
            var tempStatus = getBinaryArray($scope.ram[3]);
            var tempCarry = tempStatus[0];

            $scope.carry = oldfile[0];
            tempStatus[0] = oldfile[0];
            $scope.ram[3] = convertArrayToHex(tempStatus);

            for (var i = 0; i <= 7; i++) {
                if (i == 7) {
                    rrfresult[i] = tempCarry;
                } else {
                    rrfresult[i] = oldfile[i + 1];
                }
            }
            rrfresult = convertArrayToHex(rrfresult);
            if (d == 1) {
                $scope.ram[f] = rrfresult;
            } else {
                $scope.w_reg = rrfresult;
            }
            DataPic.Zeit(1);
            DataPic.IncTaktanzahl(1);

        },
        "SUBWF": function (f, d) {
            var zahl1 = parseInt($scope.ram[f], 16);
            var zahl2 = getZweierKomplement($scope.w_reg);
            var result = zahl1 + zahl2;
            result = result.toString(16);
            var tempW_RegArray = getBinaryArray($scope.w_reg);
            var tempaddresult_Array = getBinaryArray(result);
            var wReg_firstN, addresresult_FirstN;

            wReg_firstN = tempW_RegArray[4].toString()
                + tempW_RegArray[3].toString()
                + tempW_RegArray[2].toString()
                + tempW_RegArray[1].toString()
                + tempW_RegArray[0].toString();

            addresresult_FirstN = tempaddresult_Array[4].toString()
                + tempaddresult_Array[3].toString()
                + tempaddresult_Array[2].toString()
                + tempaddresult_Array[1].toString()
                + tempaddresult_Array[0].toString();

            if (parseInt(result, 16) > 255) {

                var temp = parseInt(result, 16) - 256;
                setCarry();
                result = temp.toString(16);
            } else {
                clrCarry();
            }
            if ((parseInt(wReg_firstN, 2) < 16) && (parseInt(addresresult_FirstN, 2) > 15) && (tempW_RegArray[4] == tempaddresult_Array[4])) {
                setDigitCarry();
            } else {
                clrDigitCarry();
            }

            if (parseInt(result, 16) == 0) {
                setZeroFlag();
            } else {
                clrZeroFlag();
            }
            if (d == 1) {
                $scope.ram[f] = result;
            } else {
                $scope.w_reg = result;
            }
            DataPic.Zeit(1);
            DataPic.IncTaktanzahl(1);
        },
        "SWAPF": function (f, d) {
            var tempArray = getBinaryArray($scope.ram[f]);
            var nibble1 = tempArray[3].toString() + tempArray[2].toString() + tempArray[1].toString() + tempArray[0].toString();
            var nibble2 = tempArray[7].toString() + tempArray[6].toString() + tempArray[5].toString() + tempArray[4].toString();
            var swapResult = nibble1 + nibble2;
            swapResult = parseInt(swapResult, 2);
            swapResult = swapResult.toString(16);

            if (d == 1) {
                $scope.ram[f] = swapResult;
            } else {
                $scope.w_reg = swapResult;
            }
            DataPic.Zeit(1);
            DataPic.IncTaktanzahl(1);
        },
        "XORWF": function (f, d) {

            var fileRegValue = $scope.ram[f];
            var xorresult = ((parseInt($scope.w_reg, 16)) ^ (parseInt(fileRegValue, 16)));
            xorresult = xorresult.toString(16);

            if (parseInt(xorresult, 16) == 0) {
                setZeroFlag();
            } else {
                clrZeroFlag();
            }

            if (d == 1) {

                $scope.ram[f] = xorresult;
            } else {
                $scope.w_reg = xorresult;
            }
            DataPic.Zeit(1);
            DataPic.IncTaktanzahl(1);
        },
        "BCF": function (f, b) {
            var result;
            var tempFile = getBinaryArray($scope.ram[f]);
            tempFile[b] = 0;
            result = convertArrayToHex(tempFile);
            $scope.ram[f] = result;
            DataPic.Zeit(1);
            DataPic.IncTaktanzahl(1);
        },
        "BSF": function (f, b) {
            var result = "";
            var tempFile = getBinaryArray($scope.ram[f]);
            tempFile[b] = 1;
            result = convertArrayToHex(tempFile);
            $scope.ram[f] = result;
            DataPic.Zeit(1);
            DataPic.IncTaktanzahl(1);
        },
        "BTFSC": function (f, b) {
            //DO SOMETHING
            var tempFle = getBinaryArray($scope.ram[f]);
            if (tempFle[b] == 0) {
                //bei gesetztem bit wird statt dem nächsten Befehl ein NOP aufgerufen
                //$scope.callOperation("0");
                DataPic.Instructioncounter++;
                DataPic.Zeit(2);
                DataPic.IncTaktanzahl(2);
            } else {
                //$scope.Instructioncounter++;
                //Ansonsten Tue nix
                DataPic.Zeit(1);
                DataPic.IncTaktanzahl(1);
            }
        },
        "BTFSS": function (f, b) {
            var tempFle = getBinaryArray($scope.ram[f]);
            if (tempFle[b] == 1) {
                //bei gesetztem bit wird statt dem nächsten Befehl ein NOP aufgerufen
                DataPic.Instructioncounter++;
                DataPic.Zeit(2);
                DataPic.IncTaktanzahl(2);
            } else {
                //$scope.Instructioncounter++;
                //Ansonsten tue nix
                DataPic.Zeit(1);
                DataPic.IncTaktanzahl(1);
            }
        },
        "ADDLW": function (k) {
            var tempW_Reg = parseInt($scope.w_reg, 16);
            var addresult = tempW_Reg + k;
            addresult = addresult.toString(16);
            var tempW_RegArray = getBinaryArray($scope.w_reg);
            var tempaddresult_Array = getBinaryArray(addresult);
            var wReg_firstN, addresresult_FirstN;
            //kommentar
            ///TODO Diese Funktionen lassen sich gut refactorn

            wReg_firstN = tempW_RegArray[4].toString()
                + tempW_RegArray[3].toString()
                + tempW_RegArray[2].toString()
                + tempW_RegArray[1].toString()
                + tempW_RegArray[0].toString();

            addresresult_FirstN = tempaddresult_Array[4].toString()
                + tempaddresult_Array[3].toString()
                + tempaddresult_Array[2].toString()
                + tempaddresult_Array[1].toString()
                + tempaddresult_Array[0].toString();

            if (parseInt(addresult, 16) > 255) {

                var temp = parseInt(addresult, 16);
                setCarry();
                temp = temp - 256;
                addresult = temp.toString(16);
            } else {
                clrCarry();
            }

            if ((parseInt(wReg_firstN, 2) < 16) && (parseInt(addresresult_FirstN, 2) > 15) && (tempW_RegArray[4] == tempaddresult_Array[4])) {

                setDigitCarry();
            } else {
                clrDigitCarry();
            }

            if (parseInt(addresult, 16) == 0) {
                setZeroFlag();
            } else {
                clrZeroFlag();
            }

            $scope.w_reg = addresult;
            DataPic.Zeit(1);
            DataPic.IncTaktanzahl(1);
        },
        "ANDLW": function (k) {
            var andresult = ((parseInt($scope.w_reg, 16)) & (k));
            andresult = andresult.toString(16);
            if (parseInt(andresult, 16) == 0) {
                setZeroFlag();
            } else {
                clrZeroFlag();
            }
            $scope.w_reg = andresult;
            DataPic.Zeit(1);
            DataPic.IncTaktanzahl(1);
        },
        "CALL": function (k) {

            var vergleichszeile = k.toString(16);

            var tempPcLath= $scope.ram[10].toString(16);
            DataPic.ProgramStack.push(DataPic.Instructioncounter);
            $scope.ProgramStack = DataPic.ProgramStack;

            vergleichszeile=getCallArray(vergleichszeile);
            tempPcLath= getBinaryArray(tempPcLath);
            var pcLath43=[];
            pcLath43.push(tempPcLath[4]);
            pcLath43.push(tempPcLath[3]);
            var tempPCLow=[];
            for (var i=10;i>=0;i--){
                tempPCLow.push(vergleichszeile[i]);
            }
            var newPC=pcLath43.concat(tempPCLow);
            newPC=newPC.join();
            newPC=newPC.replace(/,/g,'');
            DataPic.GotoFlag = 1;

            DataPic.Instructioncounter=parseInt(newPC,2);
            DataPic.Zeit(1);
            DataPic.IncTaktanzahl(1);

        },
        "CLRWDT": function () {
            //DO SOMETHING
            DataPic.watchdogtimer = 0;
            $scope.TimeOutbit = 1;
            var tempStatus = getBinaryArray($scope.ram[3]);
            tempStatus[3] = 1;
            $scope.ram[3] = tempStatus;
            DataPic.Zeit(1);
            DataPic.IncTaktanzahl(1);
        },
        "GOTO": function (k) {
            /*
             //Das PCLATH wird als Hex Zahl gelagert, zum verarbeiten wird es aber als Bit array Benötigt, daher Umwandlung
             var PCLATHarray=getBinaryArray($scope.PCLATH);
             var literalArray=getBinaryLiteralArray(k);
             //Zur Vereinfachten Weiterverarbeitung wird ein neues Array mit einer 2 Bit größe erstellt
             //In dieses werden das 4. und 3. Bit des PCLATH gespeichert
             var PCLATH43=new Array(2);

             //Laden der 2 PCLATH bits in das Verarbeitungsarray
             PCLATH43[0]=PCLATHarray[3];
             PCLATH43[1]=PCLATHarray[4];

             //Das Literalarray enthält 11 Bit und PCLATH 2 Bit damit der PC die nötigen 13 Bit größe bekommt,
             //Müssen diese mit dem Concat Befehl konkateniert werden
             var PCLnewArray= PCLATH43.concat(literalArray);

             //Der Join Befehl enfernt die "," aus einem Array. Dadurch entsteht eine Binäre Zahl, die zu einem Int
             //Umgewandelt werden kann
             var PCLBefehl=parseInt(PCLnewArray.join(''),2);

             //Umwandlung der Integer Zahl in einen Hex String wert
             PCLBefehl = PCLBefehl.toString(16);

             $scope.ProgramCounter=PCLBefehl;
             */
            var vergleichszeile = k.toString(16);

            for (var i = 0; i <= $scope.operations.length; i++) {
                if (parseInt($scope.operations[i].zeile, 16) == parseInt(vergleichszeile, 16)) {
                    DataPic.GotoFlag = 1;
                    DataPic.Instructioncounter = parseInt($scope.operations[i].zeile, 16);
                    break;
                }
            }

            DataPic.Zeit(2);
            DataPic.IncTaktanzahl(2);
        },
        "IORLW": function (k) {
            var andresult = ((parseInt($scope.w_reg, 16)) | (k));
            andresult = andresult.toString(16);
            if (parseInt(andresult, 16) == 0) {
                setZeroFlag();
            } else {
                clrZeroFlag();
            }
            $scope.w_reg = andresult;
            DataPic.Zeit(1);
            DataPic.IncTaktanzahl(1);
        },
        "MOVLW": function (k) {
            $scope.w_reg = k.toString(16);
            DataPic.Zeit(1);
            DataPic.IncTaktanzahl(1);


        },
        "RETFIE": function () {
            ///TODO me: Muss getestet werden!
            DataPic.GotoFlag = 1;
            $scope.ram[11] = (parseInt($scope.ram[11], 16) & parseInt("01111111", 2)).toString(16);
            DataPic.Instructioncounter = DataPic.ProgramStack[DataPic.ProgramStack.length - 1] + 1;
            DataPic.ProgramStack.pop();
            DataPic.Zeit(2);
            DataPic.IncTaktanzahl(2);
        },
        "RETLW": function (k) {
            ///TODO: TESTEN!
            //Der übergebene Literal muss vor der Speicherung in einen Hexwert umgewandelt werden
            DataPic.GotoFlag = 1;
            $scope.w_reg = k.toString(16);
            //Das Top of Stack von ProgramStack wird durch die maxlänge-1 bestimmt, da es keine native fkt dafür gibt
            //Und im ProgramCounter abgespeichert
            DataPic.Instructioncounter = DataPic.ProgramStack[DataPic.ProgramStack.length - 1] + 1;
            //Nach dem Übertrag wird der TOS vom ProgramStack gelöscht
            DataPic.ProgramStack.pop();
            $scope.ProgramStack = DataPic.ProgramStack;
            DataPic.Zeit(1);
            DataPic.IncTaktanzahl(1);
        },
        "RETURN": function () {
            //Wie RETLW nur ohne Literalübergabe
            //Das Top of Stack von ProgramStack wird durch die maxlänge-1 bestimmt, da es keine native fkt dafür gibt
            //Und im ProgramCounter abgespeichert
            DataPic.GotoFlag = 1;
            DataPic.Instructioncounter = DataPic.ProgramStack[DataPic.ProgramStack.length - 1] + 1;
            //Nach dem Übertrag wird der TOS vom ProgramStack gelöscht
            DataPic.ProgramStack.pop();
            $scope.ProgramStack = DataPic.ProgramStack;
            DataPic.Zeit(1);
            DataPic.IncTaktanzahl(1);
        },
        "SLEEP": function () {
            ///TODO: Wie zur Hölle soll man des Simulieren ??????????
            DataPic.watchdogtimer = 0;
            $scope.wdtPrescaler = 0;
            $scope.TimeOutbit = 1;
            $scope.PowerDownbit = 0;
            var tempStatus = getBinaryArray($scope.ram[3]);
            tempStatus[4] = 1;
            tempStatus[3] = 0;
            $scope.ram[3] = convertArrayToHex(tempStatus);
            DataPic.Sleepflag=true;
            // Hier sollte sowas wie ein Sleep kommen, aber kp wie der umzusetzten ist ...
            // Absolut kp
            
            DataPic.Zeit(1);
            DataPic.IncTaktanzahl(1);
        },
        "SUBLW": function (k) {
            var zahl1 = k;
            var zahl2 = getZweierKomplement($scope.w_reg);
            var result = zahl1 + zahl2;
            result = result.toString(16);
            var tempW_RegArray = getBinaryArray($scope.w_reg);
            var tempaddresult_Array = getBinaryArray(result);
            var wReg_firstN, addresresult_FirstN;

            wReg_firstN = tempW_RegArray[4].toString()
                + tempW_RegArray[3].toString()
                + tempW_RegArray[2].toString()
                + tempW_RegArray[1].toString()
                + tempW_RegArray[0].toString();

            addresresult_FirstN = tempaddresult_Array[4].toString()
                + tempaddresult_Array[3].toString()
                + tempaddresult_Array[2].toString()
                + tempaddresult_Array[1].toString()
                + tempaddresult_Array[0].toString();

            if (parseInt(result, 16) > 255) {
                var temp = parseInt(result, 16) - 256;
                setCarry();
                result = temp.toString(16);
            } else {
                clrCarry();
            }
            if ((parseInt(wReg_firstN, 2) < 16) && (parseInt(addresresult_FirstN, 2) > 15) && (tempW_RegArray[4] == tempaddresult_Array[4])) {
                setDigitCarry();
            } else {
                clrDigitCarry();
            }

            if (parseInt(result, 16) == 0) {
                setZeroFlag();
            } else {
                clrZeroFlag();
            }
            $scope.w_reg = result;
            DataPic.Zeit(1);
            DataPic.IncTaktanzahl(1);
        },
        "XORLW": function (k) {
            var xorlresult = ((parseInt($scope.w_reg, 16)) ^ (k));
            xorlresult = xorlresult.toString(16);
            if (parseInt(xorlresult, 16) == 0) {
                setZeroFlag();
            } else {
                clrZeroFlag();
            }
            $scope.w_reg = xorlresult;
            DataPic.Zeit(1);
            DataPic.IncTaktanzahl(1);
        }
    };

    $scope.rollBackState = function (lastState) {
        for (var i = 0; i <= $scope.ram.length - 1; i++) {
            $scope.ram[i] = lastState.ram[i];
        }
        $scope.w_reg = lastState.w_reg;
        DataPic.Instructioncounter = lastState.InstructionCounter;  //lastState.Instructioncounter
        DataPic.AnzeigeIC = lastState.AnzeigeIC; // lastState.AnzeigeIC
        $scope.digitCarry = lastState.digitCarry;
        $scope.carry = lastState.carry;
        $scope.zeroFlag = lastState.zeroFlag;
        DataPic.Laufzeit = lastState.laufzeit;
    };
    $scope.changePortBbit = function (bitpos) {
        var temp = getBinaryArray($scope.ram[6]);
        if (temp[bitpos] == 1) {
            temp[bitpos] = 0;
            $scope.PortBbits[bitpos] = 0;
        } else {
            temp[bitpos] = 1;
            $scope.PortBbits[bitpos] = 1;
        }
        $scope.ram[6] = convertArrayToHex(temp);
        $scope.PORTB = $scope.ram[6];
    };
    $scope.changePortAbit = function (bitpos) {
        var temp = getBinaryArray($scope.ram[5]);
        if (temp[bitpos] == 1) {
            temp[bitpos] = 0;
            $scope.PortAbits[bitpos] = 0;
        } else {
            temp[bitpos] = 1;
            $scope.PortAbits[bitpos] = 1;
        }
        $scope.ram[5] = convertArrayToHex(temp);
        $scope.PORTA = $scope.ram[5];
    };

    $scope.calculatePrescale = function () {

        var tempOPTreg = getBinaryArray($scope.ram[81]);
        var prescalerVal = tempOPTreg[2].toString() + tempOPTreg[1].toString() + tempOPTreg[0].toString();
        prescalerVal = parseInt(prescalerVal, 2);
        var prescaler = Math.pow(2, prescalerVal);

        if (tempOPTreg[3] == 0) {
            return (4 * prescaler);
        } else {
            return (4);
        }
    };
    $scope.watchdogPrescale = function () {

        var tempOPTreg = getBinaryArray($scope.ram[81]);
        var prescalerVal = tempOPTreg[2].toString() + tempOPTreg[1].toString() + tempOPTreg[0].toString();
        prescalerVal = parseInt(prescalerVal, 2);
        var prescaler = Math.pow(2, prescalerVal);

        if (tempOPTreg[3] == 1) {
            return (prescaler);
        } else {
            return (1);
        }
    };

    $scope.resetPic = function () {
        for (var i = 0; i <= $scope.ram.length - 1; i++) {
            $scope.ram[i] = 0;
        }
        ///TODO Faktory auslagern
        $scope.PCL = '00';
        $scope.ram[3] = '18';
        $scope.STATUS = $scope.ram[3];
        DataPic.Instructioncounter = 0;
        $scope.Instructioncounter = 0;
        DataPic.AnzeigeIC = 0;
        $scope.StopFlag = 1;
        $scope.ProgramCounter = 0;
        $scope.ProgramStack = [];
        $scope.zeroFlag = 0;
        $scope.digitCarry = 0;
        $scope.carry = 0;
        DataPic.watchdogtimer = 0;
        $scope.w_reg = '00';
        DataPic.Laufzeit = 0;
        $scope.Laufzeit = 0;
        $scope.OPTION_REG = 'ff';
        $scope.TRISA = '1f';
        $scope.TRISB = 'ff';
        $scope.RP0 = 0;
        $scope.TimeOutbit = 1;
        $scope.PowerDownbit = 1;
        DataPic.Sleepflag=false;
    };

    $scope.$watch('ram[4]', function () {
        if ($scope.ram[4] != 0) {
            $scope.ram[0] = $scope.ram[parseInt($scope.ram[4], 16)];
        } else {
            $scope.ram[0] = '00';
        }
    });
    $scope.$watch('ram[0]', function (newValue, oldValue) {
        $scope.ram[parseInt($scope.ram[4], 16)] = newValue;
    });
    $scope.$watch(function () {
        return DataPic.Instructioncounter
    }, function () {
        var tempPC = getBinaryArray(DataPic.Instructioncounter.toString(16));
        var tempPClow = "";
        for (var i = 0; i < 8; i++) {
            tempPClow = tempPC[i].toString() + tempPClow;
        }
        tempPClow = parseInt(tempPClow, 2);
        $scope.ram[2] = tempPClow.toString(16);

    });
    /*
     $scope.$watch('ram[2]',function(){
     DataPic.Instructioncounter=parseInt($scope.ram[2],16);
     })

     */

    changeProgramCounter = function () {
        $scope.GotoFlag = 1;
        var pcLow = parseInt($scope.ram[2], 16);
        var pcLArray = [];
        for (var i = 0; i < 8; i++) {
            pcLArray[i] = (pcLow >> i) & 1;
        }
        var pcLath = parseInt($scope.ram[10], 16);
        var pcLathArray = [];
        for (var i = 0; i < 8; i++) {
            pcLathArray[i] = (pcLath >> i) & 1;
        }
        var PCResult = "";
        PCResult = pcLathArray[4].toString() + pcLathArray[3].toString() +
            pcLathArray[2].toString() + pcLathArray[1].toString() +
            pcLathArray[0].toString() +
            pcLArray[7].toString() + pcLArray[6].toString() +
            pcLArray[5].toString() + pcLArray[4].toString() +
            pcLArray[3].toString() + pcLArray[2].toString() +
            pcLArray[1].toString() + pcLArray[0].toString();

        PCResult = parseInt(PCResult, 2);
        DataPic.Instructioncounter = PCResult;
    }


});