app.controller('ramcontroller', function ($scope,DataPic,$timeout) {
    $scope.ram=[];
    //Deklaration Arbeitsregister und die Flags
    $scope.Instructioncounter=DataPic.AnzeigeIC;
    $scope.w_reg = '00';
    $scope.digitCarry = 0;
    $scope.zeroFlag = DataPic.zeroFlag;
    $scope.carry = DataPic.carry;
    $scope.ProgramStack=DataPic.ProgramStack;

    //Deklaration Specialfunction Register
    $scope.Indirect_addr = '00';
    $scope.TMR0 = '00';
    $scope.OPTION_REG = $scope.ram[129];
    $scope.PCL = '00';
    $scope.STATUS = '00';
    $scope.FSR = '00';
    $scope.EEDATA = '00';
    $scope.EECON1 = '00';
    $scope.EEADR = '00';
    $scope.EECON2 = '00';
    $scope.PCLATH = '00';
    $scope.INTCON = '00';
    $scope.TMR0Flag=0;

//Dummy zum befüllen des rams
    var GPR1 = new Array();
    for (var i = 0; i < 80; i++) {
        GPR1[i] = '00';
    }

    $scope.ram = GPR1;

    $scope.runTimer = function () {
        var runner;
        if($scope.StopFlag==false) {

            var tempTMR0 = parseInt($scope.ram[1], 16);
            if (tempTMR0 == 255) {
                var tempIntcon = parseInt($scope.ram[11], 16);
                var IntconArray = [];

                for (var i = 0; i < 8; i++) {
                    IntconArray[i] = (tempIntcon >> i) & 1;
                }
                IntconArray[3] = 1;

                var FinalIntcon = "";
                FinalIntcon = BinArray[7].toString() + BinArray[6].toString()
                    + BinArray[5].toString() + BinArray[4].toString()
                    + BinArray[3].toString() + BinArray[2].toString()
                    + BinArray[1].toString() + BinArray[0].toString();
                FinalIntcon = parseInt(FinalIntcon, 2);
                FinalIntcon = FinalIntcon.toString(16);
                $scope.ram[11] = FinalIntcon;

            }
        }

        runner=$timeout(function() {
            if($scope.StopFlag==false){
                $scope.runTimer();
            }
        },$scope.calculateVerzug()/(DataPic.Takt*1000000));


    };
    var intramAddresse;
    $('#ramModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget); // Button, der das Modal ausgelöst hat
        var ramaddress = button.data('whatever'); // Infos aus data-*-Attributen extrahieren
        intramAddresse=parseInt(ramaddress,16);
        var modal = $(this);
        modal.find('.modal-title').text('Speicheradresse: ' + ramaddress + 'h');
    });
    $scope.saveNewRam = function (newWert) {
        $scope.ram[intramAddresse]=newWert;
    };
    
});
