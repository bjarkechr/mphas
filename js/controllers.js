var mphasControllers = angular.module('mphasControllers', []);

mphasControllers.controller('AddEntryCtrl', ['$scope', 'MeterReadings', 'DataFormatService', '$window', '$rootScope',
	function ($scope, MeterReadings, DataFormatService, $window, $rootScope) {

        $scope.useCustomreadingTsDate = false;
        $scope.readingTsDate = new Date();
        $scope.readingTsTime = new Date();

        $scope.addSingleEntry = function () {
            var newEntry = new MeterReadings();

            var date = new Date();

            if ($scope.useCustomreadingTsDate) {
                date = new Date(
                    $scope.readingTsDate.getFullYear(),
                    $scope.readingTsDate.getMonth(),
                    $scope.readingTsDate.getDate(),
                    $scope.readingTsTime.getHours(),
                    $scope.readingTsTime.getMinutes(),
                    $scope.readingTsTime.getSeconds());
            }

            var dateArr = DataFormatService.dateToArray(date);

            newEntry.readingTs = dateArr;
            newEntry.heating = $scope.heatingText;
            newEntry.water = $scope.waterText;

            console.log($scope.heatingText);

            newEntry.$save(function () {
                    $rootScope.$broadcast('requery');

                    $window.alert('Added entry.')
                },
                function (httpResponse) {
                    $window.alert(httpResponse.data.message);
                });
        };

	}]);

mphasControllers.controller('OutputReadingsCtrl', ['$scope', 'MeterReadings', 'DataFormatService', '$window',
	function ($scope, MeterReadings, DataFormatService, $window) {

        $scope.meterReadings = [];
        $scope.displayLimit = 50;
        $scope.orderByPredicate = '-readingTs';
        $scope.querying = false;

        $scope.queryEntries = function () {
            $scope.meterReadings = [];
            $scope.querying = true;

            MeterReadings.query(null,
                function (data) {
                    data.forEach(function (element) {
                            var meterReading = {};

                            meterReading.id = element.id;
                            meterReading.heating = element.heating;
                            meterReading.water = element.water;

                            var readingTs = DataFormatService.dateFromArray(element.readingTs);

                            meterReading.readingTs = readingTs;
                            meterReading.readingTsDisp = DataFormatService.dateToString(readingTs);

                            $scope.meterReadings.push(meterReading);


                        },
                        function () {
                            $scope.querying = false;
                        });

                });
        }

        $scope.queryEntries();

        $scope.deleteEntry = function (id) {
            var res = $window.confirm('Delete entry with id ' + id + '?');
            if (res === true) {
                var parms = {
                    'entryId': id
                };

                MeterReadings.delete(parms,
                    function () {
                        $scope.queryEntries();
                    },
                    function (httpResponse) {
                        $window.alert(httpResponse.data.message);
                    }
                );
            }
        }

        $scope.$on('requery', function (event) {
            $scope.queryEntries();
        });
	}]);

mphasControllers.controller('AddMultibleReadingsCtrl', ['$scope', 'MeterReadings', 'DataFormatService', '$window', '$rootScope',
	function ($scope, MeterReadings, DataFormatService, $window, $rootScope) {

        $scope.multiReadingsText = '';

        $scope.addMultibleReadings = function () {
            var readingLines = $scope.multiReadingsText.split("\n");
            var numberOfReadings = readingLines.length;

            for (var i = 0; i < numberOfReadings; i++) {
                var readingParts = readingLines[i].split('\t');

                //Date
                var dateSplitArr = readingParts[0].split('-');
                var year = dateSplitArr[2];
                var month = dateSplitArr[1] - 1;
                var day = dateSplitArr[0];
                var readingDate = new Date(year, month, day);

                console.log(readingDate);

                console.log(DataFormatService.dateToArray(readingDate));

                console.log(dateSplitArr);
                console.log(readingDate);


                var newReading = new MeterReadings();
                newReading.readingTs = DataFormatService.dateToArray(readingDate);
                newReading.heating = readingParts[1];
                newReading.water = readingParts[2];

                console.log(newReading);

                newReading.$save(function () {
                        $rootScope.$broadcast('requery');

                        //$window.alert('Added entry.')
                    },
                    function (httpResponse) {
                        $window.alert(httpResponse.data.message);
                    });
            }

            /*
			var date = new Date();

			if ($scope.useCustomreadingTsDate)
			{
				date = new Date(
					$scope.readingTsDate.getFullYear(),
					$scope.readingTsDate.getMonth(),
					$scope.readingTsDate.getDate(), 
					$scope.readingTsTime.getHours(),
					$scope.readingTsTime.getMinutes(),
					$scope.readingTsTime.getSeconds());
			}

			var dateArr = DataFormatService.dateToArray(date);
			
			newEntry.readingTs = dateArr;
			newEntry.heating = $scope.heatingText;
			newEntry.water = $scope.waterText;

			console.log($scope.heatingText);

			newEntry.$save(function()
			{			
				$rootScope.$broadcast('requery');

				$window.alert('Added entry.')
			},
			function(httpResponse)
			{
				$window.alert(httpResponse.data.message);
			});
*/
        };

}]);