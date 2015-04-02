var mphasApp = angular.module('mphasApp', [
	'ngRoute',
	'ngResource',
	'ui.bootstrap',
	'mphasControllers'
	]);

mphasApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/addentry', {
			templateUrl: 'partials/add-entry.html',
			controller: 'AddEntryCtrl'
		}).
		otherwise({
			redirectTo: '/addentry'
		});
	}]);

mphasApp.factory('HeatingEntries', ['$resource', function($resource){
	return $resource('/mphas/server/HeatingEntries/:entryId', null, {});
}])