angular.module('starter.controllers', [])

.controller('SurveyCtrl', function ($scope,SurveyFactory, $stateParams) {



	$scope.getSurveys = function () {
		SurveyFactory.getSurveys()
		.then(function (response) {
			$scope.surveys = response.data;
			console.log ('Questionnaires récupérées');
		}, function (error) {
			console.log ('Erreur lors de la récupération des questionnaires : ' + error.message);
		});
	};

	$scope.getSurveys();
})

.controller('QuestionCtrl', function($scope, $stateParams, TDCardDelegate, $timeout, QuestionFactory) {

	var cardTypes;

	$scope.getQuestions = function (id) {
		QuestionFactory.getQuestionsOfSurvey(id)
		.then(function (response) {
			$scope.questions = response.data;
			console.log ('Questions du questionnaire "' + $scope.questions[0].surveys.title + '" récupérées');
			initCard();
		}, function (error) {
			console.log ('Erreur lors de la récupération des questions : ' + error.message);
		});
	};

	$scope.updateQuestion = function (question) {
		QuestionFactory.updateQuestion(question)
		.then(function (response) {
			console.log ('Compteur de question mis à jour');
		}, function (error) {
			console.log ('Erreur lors de la mise à jour de la question : ' + error.message);
		});
	};

	$scope.getQuestions($stateParams.id);

	function initCard() {
		var cardTypes = [];
		for (var i = 0; i < $scope.questions.length; i++)
		{
			cardTypes.push(
				{ 	object: $scope.questions[i],
					question: $scope.questions[i].label,
					response_left: $scope.questions[i].answer1,
					response_right: $scope.questions[i].answer2})
		}

		$scope.cards = {
			master: Array.prototype.slice.call(cardTypes, 0),
			active: Array.prototype.slice.call(cardTypes, 0),
			discards: [],
			liked: [],
			disliked: []
		}
	}

	$scope.cardDestroyed = function(index) {
		$scope.cards.active.splice(index, 1);
	};

	$scope.addCard = function() {
		var newCard = cardTypes[0];
		$scope.cards.active.push(angular.extend({}, newCard));
	};

	$scope.end = function() {
		console.log('end');
	}

	$scope.$on('removeCard', function(event, element, card) {
		var discarded = $scope.cards.master.splice($scope.cards.master.indexOf(card), 1);
		$scope.cards.discards.push(discarded);
	});

	$scope.cardSwipedLeft = function(index) {
		var card = $scope.cards.active[index];
		var question = card.object
		question.counter2++;
		$scope.updateQuestion(question);
		$scope.cards.disliked.push(card);
	};

	$scope.cardSwipedRight = function(index) {
		var card = $scope.cards.active[index];
		var question = card.object
		question.counter1++;
		$scope.updateQuestion(question);
		$scope.cards.liked.push(card);
	};
})

.controller('CardCtrl', function($scope, TDCardDelegate) {

})

.controller('AccountCtrl', function($scope) {
	$scope.settings = {
		enableFriends: true
	};
});
