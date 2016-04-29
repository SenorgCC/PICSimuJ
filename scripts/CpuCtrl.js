app.controller('CPU', function ($scope) {

    function getDirectory(binOP) {
        var directory = parseInt(binOP, 2) & parseInt('00000010000000', 2);
        directory = directory >> 7;
        return directory;
    }

    function getFileregister(binOP) {
        var file = parseInt(binOP, 2) & parseInt('00000001111111', 2);
        return file;
    }

    function getbitAddress(binOP) {
        var bitAddress = parseInt(binOP, 2) & parseInt('00001110000000', 2);
        bitAddress = bitAddress >> 7;
        return bitAddress;
    }

    function getLiteralfieldshort(binOP) {
        var literalfield = parseInt(binOP, 2) & parseInt('00000011111111', 2);
        return literalfield;
    }

    function getLiteralfieldlong(binOP) {
        var literalfield = parseInt(binOP, 2) & parseInt('00011111111111', 2);
        return literalfield;
    }

    function getBinaryArray(hexVal) {

        //Sowohl der Inhalt des W Registers als auch des File Registers sind in Hex kodiert
        //Die meisten Funktionen benötigen aber bitweise operationen -> Umwandlungsfunktion, liefert ein Bitarray
        var tempHex_Val = parseInt(hexVal, 16);
        var result_Binary = [];

        for (var i = 0; i < 8; i++) {
            result_Binary[i] = (tempHex_Val >> i) & 1;
        }
        return result_Binary;

    }

    function convertArrayToHex(binValue) {
        var result = "";
        result = binValue[7].toString() + binValue[6].toString()
            + binValue[5].toString() + binValue[4].toString()
            + binValue[3].toString() + binValue[2].toString()
            + binValue[1].toString() + binValue[0].toString();
        result = parseInt(result, 2);
        result = result.toString(16);
        return result;
    }

    $scope.callOperation = function (hexOP) {

        var befehl;
        var temp = parseInt(hexOP, 16);
        var tempbin = temp.toString(2);

        //abfrage auf den Befehl anführende "00" werden leider ausgeschnitten und js kann nativ kein binary

        if ((parseInt(tempbin, 2) & parseInt('11111100000000', 2)).toString(2) == "11100000000") {
            //Befehl ADDWF

            Befehlsausfuehrung["ADDWF"](getFileregister(tempbin), getDirectory(tempbin));

        } else if ((parseInt(tempbin, 2) & parseInt('11111100000000', 2)).toString(2) == "10100000000") {
            //ANDWF
            Befehlsausfuehrung["ANDWF"](getFileregister(tempbin), getDirectory(tempbin));

        } else if ((parseInt(tempbin, 2) & parseInt('11111110000000', 2)).toString(2) == "110000000") {
            //CLRF
            Befehlsausfuehrung["ADDWF"](getFileregister(tempbin), getDirectory(tempbin));

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
            alert("MOVF");
        } else if ((parseInt(tempbin, 2) & parseInt('11111100000000', 2)).toString(2) == "10000000") {
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

        } else if ((parseInt(tempbin, 2) & parseInt('11100000000000', 2)).toString(2) == "11100000000000") {
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

        } else if (((parseInt(tempbin, 2) & parseInt('11111100000000', 2)).toString(2) == "1101000000")
            | ((parseInt(tempbin, 2) & parseInt('11111100000000', 2)).toString(2) == "1101010000")
            | ((parseInt(tempbin, 2) & parseInt('11111100000000', 2)).toString(2) == "1101100000")
            | ((parseInt(tempbin, 2) & parseInt('11111100000000', 2)).toString(2) == "1101110000")) {

            //RETLW
            Befehlsausfuehrung["RETLW"](getLiteralfieldshort(tempbin));

        } else if ((parseInt(tempbin, 2) & parseInt('11111111111111', 2)).toString(2) == "1000") {
            //RETURN
            Befehlsausfuehrung["RETURN"]();

        } else if ((parseInt(tempbin, 2) & parseInt('11111111111111', 2)).toString(2) == "110011") {
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


    var Befehlsausfuehrung = {
        "ADDWF": function (f, d) {
            var tempW_Reg = parseInt($scope.w_reg, 16);
            var addresult = tempW_Reg + parseInt($scope.ram[f], 16);
            addresult = addresult.toString(16);
            var tempW_RegArray = getBinaryArray($scope.w_reg);
            var tempaddresult_Array = getBinaryArray(addresult);
            var wReg_firstN, addresresult_FirstN;

            ///TODO Diese Funktionen lassen sich gut refactorn
            ///TODO: Subtraktionsweg überlegen

            wReg_firstN = tempW_RegArray[3].toString() + tempW_RegArray[2].toString() + tempW_RegArray[1].toString() + tempW_RegArray[0].toString();
            addresresult_FirstN = tempaddresult_Array[4].toString() + tempaddresult_Array[3].toString() + tempaddresult_Array[2].toString() + tempaddresult_Array[1].toString() + tempaddresult_Array[0].toString();

            if (parseInt(addresult, 16) > 255) {

                var temp = parseInt(addresult, 16);
                $scope.carry = 1;
                temp = temp - 256;
                addresult = temp.toString(16);
            }

            if (parseInt(addresult, 16) == 0) {
                $scope.zeroFlag = 1;
            }

            if ((parseInt(wReg_firstN, 2) < 16) && (parseInt(addresresult_FirstN, 2) > 15)) {
                $scope.digitalCarry = 1;
            }

            if (d == 1) {

                $scope.ram[f] = addresult;
            } else {
                $scope.w_reg = addresult;
            }


        },
        "ANDWF": function (f, d) {
            var fileRegValue = $scope.ram[f];
            var andresult = ((parseInt($scope.w_reg, 16)) & (parseInt(fileRegValue, 16)));
            andresult = andresult.toString(16);

            if (parseInt(andresult, 16) == 0) {
                $scope.zeroFlag = 1;
            }

            if (d == 1) {

                $scope.ram[f] = andresult;
            } else {
                $scope.w_reg = andresult;
            }
        },
        "CLRF": function (f) {
            $scope.ram[f] = '00';
            $scope.zeroFlag = 1;
        },
        "CLRW": function () {
            $scope.w_reg = '00';
            $scope.zeroFlag = 1;
        },
        "COMF": function (f, d) {
            //DO SOMETHING
        },
        "DECF": function (f, d) {
            //DO SOMETHING
            var result = parseInt($scope.ram[f], 16) - 1;
            if (result == 0) {
                $scope.zeroFlag = 1;
            }
            result = result.toString(16);

            if (d == 1) {
                $scope.ram[f] = result;
            } else {
                $scope.w_reg = result;
            }

        },
        "DECFSZ": function (f, d) {
            var result = parseInt($scope.ram[f], 16) - 1;
            //Wenn das register um 1 dekrementiert wird und damit 0 ergibt,
            //wird statt dem nächsten Befehl ein NOP ausgeführt
            if (result == 0) {
                $scope.callOperation('00');
            } else {
                ///TODO: InstructionCounter müsste hier kommen!
            }
            result = result.toString(16);
            if (d == 1) {
                $scope.ram[f] = result;
            } else {
                $scope.w_reg = result;
            }

        },
        "INCF": function (f, d) {
            var result = parseInt($scope.ram[f], 16) + 1;
            result = result.toString(16);
            if (d == 1) {
                $scope.ram[f] = result;
            } else {
                $scope.w_reg = result;
            }
            if (result == 0) {
                $scope.zeroFlag = 1;
            }
        },
        "INCFSZ": function (f, d) {
            //DO SOMETHING
            var result = parseInt($scope.ram[f], 16) + 1;
            //Wenn das register um 1 dekrementiert wird und damit 0 ergibt,
            //wird statt dem nächsten Befehl ein NOP ausgeführt
            if (result == 0) {
                $scope.callOperation('00');
            } else {
                ///TODO: InstructionCounter müsste hier kommen!
            }
            result = result.toString(16);
            if (d == 1) {
                $scope.ram[f] = result;
            } else {
                $scope.w_reg = result;
            }
        },
        "IORWF": function (f, d) {
            //DO SOMETHING
        },
        "MOVF": function (f, d) {
            //DO SOMETHING
        },
        "MOVWF": function (f) {
            //DO SOMETHING
        },
        "NOP": function () {
            //DO SOMETHING
        },
        "RLF": function (f, d) {
            //DO SOMETHING
        },
        "RRF": function (f, d) {
            //DO SOMETHING
        },
        "SUBWF": function (f, d) {
            //DO SOMETHING
        },
        "SWAPF": function (f, d) {
            //DO SOMETHING
        },
        "XORWF": function (f, d) {
            //DO SOMETHING
        },
        "BCF": function (f, b) {
            ///TODO: Testen!
            var result;
            var tempFile = getBinaryArray($scope.ram[f]);
            tempFile[b] = 0;
            result = convertArrayToHex(tempFile);
            $scope.ram[f] = result;
        },
        "BSF": function (f, b) {
            var result = "";
            var tempFile = getBinaryArray($scope.ram[f]);
            tempFile[b] = 1;
            result = convertArrayToHex(tempFile);
            $scope.ram[f] = result;

        },
        "BTFSC": function (f, b) {
            //DO SOMETHING
            var tempFle = getBinaryArray($scope.ram[f]);
            if (tempFle[b] == 0) {
                //bei gesetztem bit wird statt dem nächsten Befehl ein NOP aufgerufen
                $scope.callOperation("0");
            } else {
                ///TODO: InstructionCounter muss her!
            }
        },
        "BTFSS": function (f, b) {
            var tempFle = getBinaryArray($scope.ram[f]);
            if (tempFle[b] == 1) {
                //bei gesetztem bit wird statt dem nächsten Befehl ein NOP aufgerufen
                $scope.callOperation("0");
            } else {
                ///TODO: InstructionCounter muss her!
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

            wReg_firstN = tempW_RegArray[3].toString() + tempW_RegArray[2].toString() + tempW_RegArray[1].toString() + tempW_RegArray[0].toString();
            addresresult_FirstN = tempaddresult_Array[4].toString() + tempaddresult_Array[3].toString() + tempaddresult_Array[2].toString() + tempaddresult_Array[1].toString() + tempaddresult_Array[0].toString();

            if (parseInt(addresult, 16) > 255) {

                var temp = parseInt(addresult, 16);
                $scope.carry = 1;
                temp = temp - 256;
                addresult = temp.toString(16);
            }

            if ((parseInt(wReg_firstN, 2) < 16) && (parseInt(addresresult_FirstN, 2) > 15)) {
                $scope.digitalCarry = 1;
            }

            if (parseInt(addresult, 16) == 0) {
                $scope.zeroFlag = 1;
            }

            $scope.w_reg = addresult;

        },
        "ANDLW": function (k) {
            var andresult = ((parseInt($scope.w_reg, 16)) & (k));
            andresult = andresult.toString(16);
            if (parseInt(andresult, 16) == 0) {
                $scope.zeroFlag = 1;
            }
            $scope.w_reg = andresult;
        },
        "CALL": function (k) {
            //DO SOMETHING
        },
        "CRLWDT": function () {
            //DO SOMETHING
        },
        "GOTO": function (k) {
            //DO SOMETHING
        },
        "IORLW": function (k) {
            //DO SOMETHING
        },
        "MOVLW": function (k) {
            //DO SOMETHING
        },
        "RETFIE": function () {
            //DO SOMETHING
        },
        "RETLW": function (k) {
            //DO SOMETHING
        },
        "RETURN": function () {
            //DO SOMETHING
        },
        "SLEEP": function () {
            //DO SOMETHING
        },
        "SUBLW": function (k) {
            //DO SOMETHING
        },
        "XORLW": function (k) {
            //DO SOMETHING
        }
    };
});