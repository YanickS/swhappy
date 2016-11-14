'use strict';

angular.module('swhappyApp')
    .factory('Register', function ($resource) {
        return $resource('api/register', {}, {
        });
    });


