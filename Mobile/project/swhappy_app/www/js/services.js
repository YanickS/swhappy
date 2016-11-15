angular.module('starter.services', [])

.factory('QuestionService', function($http){
  return{
    getAll: function(){
        return $http.get("https://swhappy.herokuapp.com/api/questions");
    }
  }
});