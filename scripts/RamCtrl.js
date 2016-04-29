app.controller('ramcontroller', function ($scope) {
    //Deklaration Arbeitsregister und die Flags
    $scope.w_reg = "62";
    $scope.digitalCarry = 0;
    $scope.zeroFlag = 0;
    $scope.carry = 0;

    //Deklaration Specialfunction Register
    $scope.Indirect_addr = '00';
    $scope.TMR0 = '00';
    $scope.OPTION_REG = '00';
    $scope.PCL = '00';
    $scope.STATUS = '00';
    $scope.FSR = '00';
    $scope.PORTA = '00';
    $scope.PORTB = '00';
    $scope.EEDATA = '00';
    $scope.EECON1 = '00';
    $scope.EEADR = '00';
    $scope.EECON2 = '00';
    $scope.PCLATH = '00';
    $scope.INTCON = '00';

//Dummy zum befüllen des rams
    var GPR1 = new Array();
    for (var i = 0; i < 68; i++) {
        GPR1[i] = 0x00;
    }

    $scope.ram = GPR1;

    $scope.getValue = function (hexAdr) {
        //Dekodierung zur Dezimalzahl
        var decAdr = parseInt(hexAdr, 16);

        //Der RAM begint bei 0Ch -> 12d damit ist die erste Position im Array nicht 0 sondern 12
        var ramAdr = decAdr - 12;

        //Ifabfrage zum Bestimmen der Array Reihe

        if (ramAdr > 67) {
            alert("Falsche Zuweisung!");
            return 0;
        } else {
            return $scope.ram[decAdr];
        }
    };

    $scope.setValue = function (hexAdr, Wert) {

        //Dekodierung zur Dezimalzahl
        var decAdr = parseInt(hexAdr, 16);

        //Der RAM begint bei 0Ch -> 12d damit ist die erste Position im Array nicht 0 sondern 12
        var ramAdr = decAdr - 12

        $scope.ram[decAdr] = Wert;
    };

});
