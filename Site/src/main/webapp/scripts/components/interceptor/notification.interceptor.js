 'use strict';

angular.module('swhappyApp')
    .factory('notificationInterceptor', function ($q, AlertService) {
        return {
            response: function(response) {
                var alertKey = response.headers('X-swhappyApp-alert');
                if (angular.isString(alertKey)) {
                    AlertService.success(alertKey, { param : response.headers('X-swhappyApp-params')});
                }
                return response;
            }
        };
    });
