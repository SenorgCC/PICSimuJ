/**
 * Created by Alex on 06.04.2016.
 */
//es werden das Register (Reg), Instructionpointer (IP) und Flags: Zero (ZF), Carry(CY) und Faultflag (Fl)
///TODO: Instructioncounter in den richtigen scope legen
var intstructioncounter = 0;


var app = angular.module('pic', ['ui.bootstrap']);

//Angularmagic zum Parsen von Dateien
//Schwarze Magie
app.directive('onReadFile', function ($parse) {
    return {
        restrict: 'A',
        scope: false,
        link: function (scope, element, attrs) {
            var fn = $parse(attrs.onReadFile);

            element.on('change', function (onChangeEvent) {
                var reader = new FileReader();
                reader.onload = function (onLoadEvent) {
                    scope.$apply(function () {
                        fn(scope, {$fileContent: onLoadEvent.target.result});
                    });
                };

                reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
            });
        }

    };
});

    pic.factory('storage', function () {
        var collection = [];

        var get = function () {
            return collection;
        };

        var add = function (item) {
            collection.push(item);
        };

        var remove = function (index) {
            collection.splice(index, 1);
        };

        // Reveal public API.
        return {
            getItems: get,
            addItem: add,
            removeItem: remove
        };
    });

/*
app.factory('meineDaten',function(){

    return {

        nachricht:'Das ist mein Text'

}
});

app.controller('Zeit', function ($scope,meineDaten) {
    function getlaufzeit(Takte) {
        $scope.Laufzeit = $scope.Laufzeit + (1 / $scope.Takt * Takte);
        alert(Laufzeit);

    }
    function ausgabe() {
        alert(JSON.stringify(meineDaten));
        
    }
    $scope.ausgabe=function () {
        ausgabe();
        
    };
    $scope.getZeit = function (Takte) {
        getlaufzeit(Takte)
        alert(Laufzeit);
    };


    
});*/
