(function () {
    'use strict';

    angular
        .module('mphasApp')
        .service('DataFormatService', DataFormatService);

    function DataFormatService() {

        this.pad = function (num, size) {
                return ('000000000' + num).substr(-size);
            },

            this.dateToString = function (date) {
                if (Object.prototype.toString.call(date) !== '[object Date]') {
                    return false;
                }

                return this.pad(date.getDate(), 2) + '-' + this.pad(date.getMonth() + 1, 2) + '-' + date.getFullYear() + ' ' + this.pad(date.getHours(), 2) + ':' + this.pad(date.getMinutes(), 2) + ':' + this.pad(date.getSeconds(), 2);
            },

            this.dateToArray = function (date) {
                if (Object.prototype.toString.call(date) !== '[object Date]') {
                    return false;
                }

                var dateArray = {};
                dateArray['year'] = date.getFullYear();
                dateArray['month'] = date.getMonth() + 1;
                dateArray['day'] = date.getDate();
                dateArray['hour'] = date.getHours();
                dateArray['minute'] = date.getMinutes();
                dateArray['second'] = date.getSeconds();
                return dateArray;
            },

            this.dateFromArray = function (dateArr) {
                return new Date(
                    dateArr.year,
                    dateArr.month - 1,
                    dateArr.day,
                    dateArr.hour,
                    dateArr.minute,
                    dateArr.second);
            }
    }

})();