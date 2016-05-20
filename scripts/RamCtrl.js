app.controller('ramcontroller', function ($scope,DataPic,$timeout) {
    $scope.ram=[];
    $scope.PortBbits=["0","0","0","0","0","0","0","0"];
    $scope.PortAbits=["0","0","0","0","0","0","0","0"];

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
    $scope.GIE=parseInt($scope.ram[11])&parseInt("10000000");
    $scope.T0IE=parseInt($scope.ram[11])&parseInt("00100000");
    $scope.T0IF=0;
    $scope.INTE=0;
    $scope.RBIE=0;
    $scope.INTF=0;
    $scope.RBIF=0;
    $scope.RB0InterruptFlag=0;
    $scope.PortBInterruptFlag=0;
//Dummy zum befüllen des rams
    var GPR1 = new Array();
    for (var i = 0; i < 256; i++) {
        GPR1[i] = '00';
    }

    $scope.ram = GPR1;

    //Javascript für das Modal zum RAM verändern
    var intramAddresse;
    $('#ramModal').on('show.bs.modal', function (event) {
        // Button, der das Modal ausgelöst hat
        var button = $(event.relatedTarget); 
        // Infos aus data-*-Attributen extrahieren
        var ramaddress = button.data('whatever'); 
        //Parsen des Hexwerts der Speicherstelle um das korrekte Arrayelement mit dem Wert befüllen zu können
        intramAddresse=parseInt(ramaddress,16); 
        var modal = $(this);
        //Überschrift des Modals, die bei der Klasse modal-title eingefügt wird
        modal.find('.modal-title').text('Speicheradresse: ' + ramaddress + 'h'); 
    });
    $scope.saveNewRam = function (newWert) {
        //Speichern des eingegebenen Werts im Modal im entsprechenden Element des Arrays
        $scope.ram[intramAddresse]=newWert; 
    };
    
});
