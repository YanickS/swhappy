(function() {
    'use strict';

    angular
        .module('swhappyApp')
        .controller('EntrepriseSurveyController', EntrepriseSurveyController);

    EntrepriseSurveyController.$inject = ['$scope', '$state', 'Question', 'SurveyByEntreprise', 'Principal'];

    function EntrepriseSurveyController ($scope, $state, Question, SurveyByEntreprise, Principal) {
        var vm = this;
        vm.displaySurvey = displaySurvey;
        
        vm.lstSurvey = null;
        vm.entreprise = null;
        vm.page = {
        	fullScreen: true
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
        	vm.page.fullScreen = false;
        }
        
    }
})();
