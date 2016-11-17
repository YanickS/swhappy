(function() {
    'use strict';

    angular
        .module('swhappyApp')
        .controller('EntrepriseSurveyController', EntrepriseSurveyController);

    EntrepriseSurveyController.$inject = ['$scope', '$state', '$stateParams', 'Question', 'SurveyByEntreprise', 'Principal', 'QuestionBySurvey', 'Survey'];

    function EntrepriseSurveyController ($scope, $state, $stateParams, Question, SurveyByEntreprise, Principal, QuestionBySurvey, Survey) {
        var vm = this;
        vm.displaySurvey = displaySurvey;
        vm.displayGraph = displayGraph;
        vm.close = close;
        vm.generateReport = generateReport;
        
        vm.lstSurvey = null;
        vm.entreprise = null;
        vm.page = {};
        vm.chart = {};
        
        if($stateParams.idSurvey){
        	Survey.get({id: $stateParams.idSurvey}, function success(result){
        		displaySurvey(result);
        		$stateParams.idSurvey = null;
        	});
        }
        
        loadAll();
        
        function initChart(){
        	vm.chart = {
            	questionId: null,
               	labels: [],
               	data: [],
       	       	all: null
       		};
        }
        
        function initPage(){
        	vm.page = {
                fullScreen: true,
               	currentSurvey: null,
               	currentQuestionLst: null
        	};
        }
        
        function loadAll(){
        	initPage();
        	initChart();
        	Principal.identity().then(function(account) {
        		vm.entreprise = account.entreprise;
        		SurveyByEntreprise.get({id: vm.entreprise.id}, function success(result){
        			vm.lstSurvey = result;
        		});
        	});
    	}
        
        function generateReport(){
        	alert("fonctionnalité à venir");
        }
        
        function close(){
        	initPage();
        	initChart();
        }
        
        function displaySurvey(survey){
        	initChart();
        	QuestionBySurvey.get({id:survey.id}, function success(result){
        		vm.page.fullScreen = false;
            	vm.page.currentSurvey = survey;
            	vm.page.currentQuestionLst = result;
        	});
        }
        
        function displayGraph(question){
        	if(question.id == vm.chart.questionId){
        		initChart();
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
