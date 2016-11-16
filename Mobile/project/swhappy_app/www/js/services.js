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
}])

.factory('SurveyFactory', ['$http', function($http) {

    var urlBase = 'https://swhappy.herokuapp.com/api/surveys';
    var SurveyFactory = {};

    SurveyFactory.getSurveys = function () {
        return $http.get(urlBase);
    };

    SurveyFactory.getSurvey = function (id) {
        return $http.get(urlBase + '/' + id);
    };

    SurveyFactory.insertSurvey = function (question) {
        return $http.post(urlBase, question);
    };

    SurveyFactory.updateSurvey = function (question) {
        return $http.put(urlBase, question)
    };

    SurveyFactory.deleteSurvey = function (id) {
        return $http.delete(urlBase + '/' + id);
    };

    SurveyFactory.getEnterpriseSurvey = function (id) {
        return $http.get(urlBase + '/entreprise/' + id);
    };

    SurveyFactory.getUserSurveys = function (id) {
        return $http.get(urlBase + '/user/' + id);
    };

    return SurveyFactory;
}]);
