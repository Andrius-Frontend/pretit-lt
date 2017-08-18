angular.module('ionic.utils', [])

.factory('$localStorage', ['$window',
    function ($window) {
        return {
            set: function (key, value) {
                $window.localStorage[key] = value;
            },
            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key) {
                return JSON.parse($window.localStorage[key] || '{}');
            },
            setObjectList: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObjectList: function (key) {
                return JSON.parse($window.localStorage[key] || '[]');
            }
        }
}])

.factory('$ageCalculator', function () {
    return {
        convertPC: function (personalCode) {
            var PCToNumber = personalCode;
            var personYear = String(PCToNumber).str.substring(1, 2);
            var MonthDigit = String(PCToNumber).str.substring(3, 4);
            var dayDigit = String(PCToNumber).str.substring(5, 6);

            var cuurentYear = new Date().getFullYear();
            var year = parseInt("19" + personYear);
            if (year > cuurentYear - 100) {
                var twoDigits = parseInt(cuurentYear.toString().substring(0, 2)) - 1;
                return parseInt(twoDigits.toString() + personYear);
            } else {
                var twoDigits = cuurentYear.toString().substring(0, 2);
                return parseInt(twoDigits + personYear);
            }
        },


    }
})




.factory('$arrayUtil', function () {
    return {
        removeById: function (array, id) {
            return _.reject(array, function (o) {
                return o.personId == id;
            });
        }
    }
})

.factory('$arrayUtil2', function () {
    return {
        removeById: function (array, id) {
            return _.reject(array, function (o) {
                return o.orderId == id;
            });
        }
    }
})

.factory('$checkboxUtil', function () {
    return {
        findChecked: function (array) {
            var selectedRows = [];
            for (var i = 0, l = array.length; i < l; i++) {
                if (array[i].checked) {
                    selectedRows.push(array[i]);
                }
            }
            return selectedRows;
        }
    }
})

.factory('$braintreeUtil', function ($q, $http) {
    return {
        getToken: function () {
            var deferred = $q.defer();
            var url = 'http://support.avedus.lt/braintree/getToken.php?callback=JSON_CALLBACK';
            $http.jsonp(url)
                .success(function (data, status, headers, config) {
                    deferred.resolve(data);
                })
                .error(function (data, status, headers, config) {
                    deferred.reject(status);
                });
            return deferred.promise;
        },
        getClient: function (token) {
            var client = new braintree.api.Client({
                clientToken: token
            });

            return client;
        }
    }
})

.factory('$serverUtil', function ($q, $http) {
    return {
        transaction: function (transactionData) {
            var deferred = $q.defer();
            var url = 'http://support.avedus.lt/braintree/transaction.php?callback=JSON_CALLBACK&nonce=' + transactionData.nonce + "&amount=" + transactionData.amount;
            $http.jsonp(url)
                .success(function (data, status, headers, config) {
                    deferred.resolve(data);
                })
                .error(function (data, status, headers, config) {
                    deferred.reject(status);
                });
            return deferred.promise;
        }
    }
});