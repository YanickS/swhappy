angular.module('starter.controllers', [])

.controller('SurveyCtrl', function ($scope, $ionicModal) {
	$scope.showSurvey = showSurvey;

	function showSurvey() {
		$ionicModal.fromTemplateUrl('templates/tab-question.html', {
			scope: $scope,
			animation: 'slide-in-up',
			hideDelay: 920
		}).then(function (modal) {
			$scope.modalSettings = modal;
			$scope.modalSettings.show();
			$scope.hideSettings = function () {
				$scope.modalSettings.hide();
			}
		});
	};
})
.controller('QuestionCtrl', function($scope, TDCardDelegate, $timeout, QuestionFactory) {

	var cardTypes;

	$scope.getQuestions = function (id) {
		QuestionFactory.getQuestionsOfSurvey(id)
		.then(function (response) {
			$scope.questions = response.data;
			initCard();
			console.log($scope.cards.active);
		}, function (error) {
			console.log ('Error retrieving questions ! ' + error.message);
		});
	};

	$scope.getQuestions(1010);

	function initCard() {
		var cardTypes = [];
		for (var i = 0; i < $scope.questions.length; i++)
		 {
			cardTypes.push(
				{ image: 'https://static1.squarespace.com/static/556c715ce4b09e217791b6fb/t/561a86eae4b0b66177b71b3d/1444579059279/?format=750w',
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

	$scope.refreshCards = function() {
    // Set $scope.cards to null so that directive reloads
    $scope.cards.active = null;
    $timeout(function() {
    	$scope.cards.active = Array.prototype.slice.call($scope.cards.master, 0);
    });
}

$scope.$on('removeCard', function(event, element, card) {
	var discarded = $scope.cards.master.splice($scope.cards.master.indexOf(card), 1);
	$scope.cards.discards.push(discarded);
});

$scope.cardSwipedLeft = function(index) {
	console.log('LEFT SWIPE');
	var card = $scope.cards.active[index];
	$scope.cards.disliked.push(card);
};

$scope.cardSwipedRight = function(index) {
	console.log('RIGHT SWIPE');
	var card = $scope.cards.active[index];
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
