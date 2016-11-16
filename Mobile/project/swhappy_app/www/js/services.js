angular.module('starter.services', [])

.factory('QuestionFactory', ['$http', function($http) {

    var urlBase = 'https://swhappy.herokuapp.com/api/questions';
    var QuestionFactory = {};

    QuestionFactory.getQuestions = function () {
        return $http.get(urlBase);
    };

    QuestionFactory.getQuestion = function (id) {
        return $http.get(urlBase + '/' + id);
    };

    QuestionFactory.insertQuestion = function (question) {
        return $http.post(urlBase, question);
    };

    QuestionFactory.updateQuestion = function (question) {
        return $http.put(urlBase, question)
    };

    QuestionFactory.deleteQuestion = function (id) {
        return $http.delete(urlBase + '/' + id);
    };

    QuestionFactory.getQuestionsOfSurvey = function (id) {
        return $http.get(urlBase + '/survey/' + id );
    };

    return QuestionFactory;
}]);