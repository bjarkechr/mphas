(function () {
    'use strict';
    angular
        .module('mphasApp')
        .config(config);

    function config($stateProvider, $urlRouterProvider) {
        // For any unmatched url, redirect to /addentry
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('addentry', {
                url: "/",
                templateUrl: 'app/components/readings_administration/add-entry.html',
                controller: 'AddEntryController',
                controllerAs: 'vm'
            });
            /*.state('addmulti', {
                url: "/addmulti",
                templateUrl: 'app/components/readings_administration/add_multible_readings.html',
                controller: 'AddMultibleReadingsController',
                controllerAs: 'vm'
            });
            */
    }

})();