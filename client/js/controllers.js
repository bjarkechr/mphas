var mphasControllers = angular.module('mphasControllers', []);

mphasControllers.controller('AddEntryCtrl', ['$scope', 'HeatingEntries', 'DataFormatService', '$window',
	function($scope, HeatingEntries, DataFormatService, $window){

		$scope.heatingEntries = [];
		$scope.useCustomEntryDate = false;
		$scope.displayLimit = 50;	

		$scope.orderByPredicate = '-entryDate';

		$scope.entryDate = new Date();
		$scope.entryTime = new Date();
		$scope.querying = false;
		
		$scope.queryEntries = function ()
		{
			$scope.heatingEntries = [];
			$scope.querying = true;

			HeatingEntries.query(null,
				function(data)
				{
					data.forEach(function(element)
					{
						var heatingEntry = {};

						heatingEntry.id = element.id;
						heatingEntry.heating = element.heating;
						heatingEntry.water = element.water;

						var entryDate = DataFormatService.dateUTCFromArray(element.entryDate);

						heatingEntry.entryDate = entryDate;
						heatingEntry.entryDateDisp = DataFormatService.dateToString(entryDate);

						$scope.heatingEntries.push(heatingEntry);

						$scope.querying = false;
					},
					function()
					{
						$scope.querying = false;
					});

				});
		}

		$scope.queryEntries();

		$scope.addEntry = function()
		{
			var newEntry = new HeatingEntries();
			
			var date = new Date();	

			if ($scope.useCustomEntryDate)
			{
				date = new Date(
					$scope.entryDate.getFullYear(),
					$scope.entryDate.getMonth(),
					$scope.entryDate.getDate(), 
					$scope.entryTime.getHours(),
					$scope.entryTime.getMinutes(),
					$scope.entryTime.getSeconds());
			}

			var dateArr = DataFormatService.dateUTCToArray(date);
			
			newEntry.entryDate = dateArr;
			newEntry.heating = $scope.heatingText;
			newEntry.water = $scope.waterText;

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

		$scope.deleteEntry = function(id)
		{
			
			var res = $window.confirm('Delete entry with id ' + id + '?');
			if (res === true)
			{
				var parms = {'entryId':id};

				HeatingEntries.delete(parms,
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