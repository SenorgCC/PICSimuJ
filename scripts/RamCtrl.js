app.controller('ramcontroller', function ($scope,DataPic) {
    //Deklaration Arbeitsregister und die Flags
    $scope.Instructioncounter=DataPic.AnzeigeIC;
    $scope.w_reg = '00';
    $scope.digitCarry = 0;
    $scope.zeroFlag = DataPic.zeroFlag;
    $scope.carry = DataPic.carry;

    //Deklaration Specialfunction Register
    $scope.Indirect_addr = '00';
    $scope.TMR0 = '00';
    $scope.OPTION_REG = '00';
    $scope.PCL = '00';
    $scope.STATUS = '00';
    $scope.FSR = '00';
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


    



});
