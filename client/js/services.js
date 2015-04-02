var mphasApp = angular.module('mphasApp');

mphasApp.service('DataFormatService', function(){
	
	this.pad = function(num, size)
	{
		return ('000000000' + num).substr(-size);
	},
	
	this.dateToString = function(date)
	{
		if (Object.prototype.toString.call(date) !== '[object Date]')
		{
			return false;
		}

		return this.pad(date.getDate(), 2) + '-' 
		+ this.pad(date.getMonth() + 1, 2)  + '-' 
		+ date.getFullYear() + ' '
		+ this.pad(date.getHours(), 2) + ':'
		+ this.pad(date.getMinutes(), 2) + ':'
		+ this.pad(date.getSeconds(), 2);
	},

	this.dateUTCToArray = function(date)
	{
		if (Object.prototype.toString.call(date) !== '[object Date]')
		{
			return false;
		}

		var dateArray = {};
		dateArray['year'] = date.getUTCFullYear();
		dateArray['month'] = date.getUTCMonth();
		dateArray['day'] = date.getUTCDate();
		dateArray['hour'] = date.getUTCHours();
		dateArray['minute'] = date.getUTCMinutes();
		dateArray['second'] = date.getUTCSeconds();
		return dateArray;
	},

	this.dateUTCFromArray = function(dateArr)
	{
		return new Date(Date.UTC(
			dateArr.year,
			dateArr.month,
			dateArr.day,
			dateArr.hour,
			dateArr.minute,
			dateArr.second)
			);
	}
});