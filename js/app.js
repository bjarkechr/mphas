var mphasApp = angular.module('mphasApp', [
	'ngRoute',
	'ngResource',
	'ui.bootstrap',
	'mphasControllers'
	]);

mphasApp.config(['$routeProvider',
	function ($routeProvider) {
        $routeProvider.
        when('/addentry', {
            templateUrl: 'partials/add-entry.html',
            controller: 'AddEntryCtrl'
        }).
        when('/addmulti', {
            templateUrl: 'partials/add_multible_readings.html',
            controller: 'AddMultibleReadingsCtrl'
        }).
        otherwise({
            redirectTo: '/addentry'
        });
	}]);

mphasApp.factory('MeterReadings', ['$resource', function ($resource) {
    return $resource('http://bjarkechr.dk/mphas/server/index.php/MeterReadings/:entryId', null, {});
}])