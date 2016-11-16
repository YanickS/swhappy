(function() {
    'use strict';

    angular
        .module('swhappyApp')
        .controller('EntrepriseSurveyController', EntrepriseSurveyController);

    EntrepriseSurveyController.$inject = ['$scope', '$state', 'Question', 'SurveyByEntreprise', 'Principal', 'QuestionBySurvey'];

    function EntrepriseSurveyController ($scope, $state, Question, SurveyByEntreprise, Principal, QuestionBySurvey) {
        var vm = this;
        vm.displaySurvey = displaySurvey;
        vm.displayGraph = displayGraph;
        vm.close = close;
        
        vm.lstSurvey = null;
        vm.entreprise = null;
        vm.page = {
        	fullScreen: true,
        	currentSurvey: null,
        	currentQuestionLst: null
        };
        
        vm.chart = {
            questionId: null,
           	labels: [],
           	data: [],
           	all: null
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
        
        function close(){
        	vm.page = {
        		fullScreen: true,
                currentSurvey: null,
                currentQuestionLst: null
        	};
        	vm.chart = {
        		questionId: null,
        	   	labels: [],
              	data: [],
      	       	all: null
       		};
        }
        
        function displaySurvey(survey){
        	vm.chart = {
            	questionId: null,
               	labels: [],
               	data: [],
       	       	all: null
       		};
        	QuestionBySurvey.get({id:survey.id}, function success(result){
        		vm.page.fullScreen = false;
            	vm.page.currentSurvey = survey;
            	vm.page.currentQuestionLst = result;
        	});
        }
        
        function displayGraph(question){
        	if(question.id == vm.chart.questionId){
        		vm.chart = {
        			questionId: null,
        	       	labels: [],
        	       	data: [],
        	       	all: null
        		};
        	} else {
        		vm.chart.labels = [];
            	vm.chart.labels.push(question.answer1);
            	vm.chart.labels.push(question.answer2);
            	vm.chart.data = [];
            	vm.chart.data.push(question.counter1);
            	vm.chart.data.push(question.counter2);
            	vm.chart.all = question.counter1 + question.counter2;
            	vm.chart.questionId = question.id;
        	}
        }
        
    }
})();
