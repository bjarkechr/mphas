var mphasControllers = angular.module('mphasControllers', []);

mphasControllers.controller('AddEntryCtrl', ['$scope', 'MeterReadings', 'DataFormatService', '$window',
	function($scope, MeterReadings, DataFormatService, $window){

		$scope.meterReadings = [];
		$scope.useCustomreadingTsDate = false;
		$scope.displayLimit = 50;	

		$scope.orderByPredicate = '-readingTs';

		//$scope.heatingText = null;
		//$scope.waterText = null;

		$scope.readingTsDate = new Date();
		$scope.readingTsTime = new Date();
		$scope.querying = false;

		$scope.tabActivity=[false,false];

		//tabActivity.indexOf(true)
		
		$scope.queryEntries = function ()
		{
			$scope.meterReadings = [];
			$scope.querying = true;

			MeterReadings.query(null,
				function(data)
				{
					data.forEach(function(element)
					{
						var meterReading = {};

						meterReading.id = element.id;
						meterReading.heating = element.heating;
						meterReading.water = element.water;

						var readingTs = DataFormatService.dateUTCFromArray(element.readingTs);

						meterReading.readingTs = readingTs;
						meterReading.readingTsDisp = DataFormatService.dateToString(readingTs);

						$scope.meterReadings.push(meterReading);

						$scope.querying = false;
					},
					function()
					{
						$scope.querying = false;
					});

				});
		}

		$scope.queryEntries();

		$scope.addSingleEntry = function()
		{
			var newEntry = new MeterReadings();
			
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

			var dateArr = DataFormatService.dateUTCToArray(date);
			
			newEntry.readingTs = dateArr;
			newEntry.heating = $scope.heatingText;
			newEntry.water = $scope.waterText;

			console.log($scope.heatingText);

			newEntry.$save(function()
			{			
				$scope.queryEntries();

				$window.alert('Added entry.')
			},
			function(httpResponse)
			{
				$window.alert(httpResponse.data.message);
			});
		};

		$scope.addMultibleReadings = function()
		{

		};

		$scope.deleteEntry = function(id)
		{
			
			var res = $window.confirm('Delete entry with id ' + id + '?');
			if (res === true)
			{
				var parms = {'entryId':id};

				MeterReadings.delete(parms,
					function()
					{
						$scope.queryEntries();
					}
					,
					function(httpResponse)
					{
						$window.alert(httpResponse.data.message);
					}
					);	
			}
		}
	}]);