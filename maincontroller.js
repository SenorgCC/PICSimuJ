/**
 * Created by Alex on 06.04.2016.
 */
//TODO: Bit Größe des Registers rausfinden!
//es werden das Register (Reg), Instructionpointer (IP) und Flags: Zero (ZF), Carry(CY) und Faultflag (Fl)
var Reg, IP, ZF, CY, FL;
var app= angular.module('PICSimulator',[]);
//die Maincontroller Funktion steuert sämtliche eingaben auf der Hauptseite
app.controller('cpucontroller',function($scope){


    var Befehlsinterpretation = function(){

    };

    var Startfunction = function (){

    };

    var Stopfunction = function (){

    };

    var Resetfunction = function (){

        Reg=[0,0,0,0,0];
        IP=0;
        ZF=false;
        CY=false;
        FL=false;
    };

});
