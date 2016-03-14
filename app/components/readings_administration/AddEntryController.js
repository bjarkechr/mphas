(function () {
    'use strict';

    angular
        .module('mphasApp')
        .controller('AddEntryController', AddEntryController);

    function AddEntryController($log) {
        var vm = this;
        
        /*
        vm.useCustomreadingTsDate = false;
        vm.readingTsDate = new Date();
        vm.readingTsTime = new Date();

        vm.addSingleEntry = function () {
            var newEntry = new MeterReadings();

            var date = new Date();

            if (vm.useCustomreadingTsDate) {
                date = new Date(
                    vm.readingTsDate.getFullYear(),
                    vm.readingTsDate.getMonth(),
                    vm.readingTsDate.getDate(),
                    vm.readingTsTime.getHours(),
                    vm.readingTsTime.getMinutes(),
                    vm.readingTsTime.getSeconds());
            }

            var dateArr = DataFormatService.dateToArray(date);

            newEntry.readingTs = dateArr;
            newEntry.heating = vm.heatingText;
            newEntry.water = vm.waterText;

            console.log($scope.heatingText);

            newEntry.$save(function () {
                    $rootScope.$broadcast('requery');

                    $window.alert('Added entry.')
                },
                function (httpResponse) {
                    $window.alert(httpResponse.data.message);
                });
        };
        */
    }

})();