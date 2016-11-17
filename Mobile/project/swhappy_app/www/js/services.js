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

.factory('Auth', ['$q', '$http', function($q, $http){

    Auth = {};

    Auth.getToken = function(credentials, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        var data = {
            username: credentials.username,
            password: credentials.password,
            rememberMe: credentials.rememberMe
        };

        return $http.post('https://swhappy.herokuapp.com/api/authenticate', data).success(authenticateSuccess).catch(errorAuthenticate);
        function authenticateSuccess (data, status) {
            return data.id_token;
        }
        function errorAuthenticate(data, status){
            return "Impossible de se connecter";
        }
    }

    Auth.getUserWithToken = function(token){
        var config = {
            headers:  {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json'
            }
        };
        return $http.get("https://swhappy.herokuapp.com/api/account", config);
    }

    return Auth;
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

    SurveyFactory.completeSurvey = function (id_survey,id_user) {
        return $http.post(urlBase + '/' + id_survey + '/completeby/' + id_user);
    };

    return SurveyFactory;
}]);
