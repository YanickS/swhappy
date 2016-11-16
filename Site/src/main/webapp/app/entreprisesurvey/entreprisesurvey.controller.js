(function() {
    'use strict';

    angular
        .module('swhappyApp')
        .controller('EntrepriseSurveyController', EntrepriseSurveyController);

    EntrepriseSurveyController.$inject = ['$scope', '$state', 'Question', 'SurveyByEntreprise', 'Principal', 'QuestionBySurvey'];

    function EntrepriseSurveyController ($scope, $state, Question, SurveyByEntreprise, Principal, QuestionBySurvey) {
        var vm = this;
        vm.displaySurvey = displaySurvey;
        
        vm.lstSurvey = null;
        vm.entreprise = null;
        vm.page = {
        	fullScreen: true,
        	currentSurvey: null,
        	currentQuestionLst: null
        };
        
        
        loadAll();
        
        function loadAll(){
        	Principal.identity().then(function(account) {
        		vm.entreprise = account.entreprise;
        		SurveyByEntreprise.get({id: vm.entreprise.id}, function success(result){
        			vm.lstSurvey = result;
        		});
        	});
    	}
        
        function displaySurvey(survey){
        	QuestionBySurvey.get({id:survey.id}, function success(result){
        		vm.page.fullScreen = false;
            	vm.page.currentSurvey = survey;
            	vm.page.currentQuestionLst = result;
        	});
        }
        
    }
})();
