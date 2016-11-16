(function() {
    'use strict';
    angular
        .module('swhappyApp')
        .factory('Question', Question)
        .factory('QuestionBySurvey', QuestionBySurvey)

    Question.$inject = ['$resource'];
    QuestionBySurvey.$inject = ['$resource'];

    function Question ($resource) {
        var resourceUrl =  'api/questions/:id';

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
    
    function QuestionBySurvey($resource){
    	var resourceUrl = 'api/questions/survey/:id';
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
