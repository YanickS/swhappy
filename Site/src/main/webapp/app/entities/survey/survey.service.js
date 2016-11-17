(function() {
    'use strict';
    angular
        .module('swhappyApp')
        .factory('Survey', Survey)
        .factory('SurveyByEntreprise', SurveyByEntreprise);

    Survey.$inject = ['$resource'];
    SurveyByEntreprise.$inject = ['$resource'];

    function Survey ($resource) {
        var resourceUrl =  'api/surveys/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
    
    function SurveyByEntreprise($resource){
    	var resourceUrl = 'api/surveys/entreprise/:id';
    	return $resource(resourceUrl, {}, {
    		'get': {
                method: 'GET',
                isArray: true,
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
    		}
    	})
    }
})();
