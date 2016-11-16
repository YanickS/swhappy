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
        return $http.put(urlBase + '/' + question.ID, question)
    };

    QuestionFactory.deleteQuestion = function (id) {
        return $http.delete(urlBase + '/' + id);
    };

    QuestionFactory.getQuestionsOfSurvey = function (id) {
        return $http.get(urlBase + '/survey' + '/' + id );
    };

    return QuestionFactory;
}]);

.factory('SurveysFactory', ['$http', function($http) {

    var urlBase = 'https://swhappy.herokuapp.com/api/surveys';
    var SurveysFactory = {};

    SurveysFactory.getSurveys = function () {
        return $http.get(urlBase);
    };

    SurveysFactory.getSurvey = function (id) {
        return $http.get(urlBase + '/' + id);
    };

    SurveysFactory.insertSurvey = function (question) {
        return $http.post(urlBase, question);
    };

    SurveysFactory.updateSurvey = function (question) {
        return $http.put(urlBase, question)
    };

    SurveysFactory.deleteSurvey = function (id) {
        return $http.delete(urlBase + '/' + id);
    };

    SurveysFactory.getEnterpriseSurvey = function (id) {
        return $http.get(urlBase + '/entreprise/' + id);
    };

    SurveysFactory.getUserSurveys = function (id) {
        return $http.get(urlBase + '/user/' + id);
    };

    return SurveysFactory;
}]);
