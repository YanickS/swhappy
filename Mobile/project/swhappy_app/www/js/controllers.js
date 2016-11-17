angular.module('starter.controllers', [])

.controller('SurveyCtrl', function ($scope, SurveyFactory, $stateParams) {

	$scope.getSurveysByUserID = function (id_user) {
		SurveyFactory.getUserSurveys(id_user)
		.then(function (response) {
			$scope.surveys = response.data;
			console.log ('Questionnaires récupérées');
		}, function (error) {
			console.log ('Erreur lors de la récupération des questionnaires : ' + error.message);
		});
	};

	$scope.user = 1003
	if ($scope.surveys){location.reload();console.log("coucou");}
	$scope.getSurveysByUserID($scope.user);
})

.controller('QuestionCtrl', function($scope, $stateParams, TDCardDelegate, $timeout, QuestionFactory,SurveyFactory) {

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

	$scope.completeSurvey = function (id_survey,id_user) {
		SurveyFactory.completeSurvey(id_survey,id_user)
		.then(function (response) {
			console.log ('Questionnaire terminé');
		}, function (error) {
			console.log ('Erreur lors de fin du questionnaire : ' + error.message);
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
		$scope.completeSurvey($stateParams.id,$stateParams.id_user);
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

.controller('AccountCtrl', function($scope, Auth) {

	$scope.accountPage = {
		login: "login",
		mdp: "password"
	};

	$scope.user = {
		identity: {},
		connect: false
	}

	$scope.connexion = function(){
		Auth.getToken({
			username: $scope.accountPage.login,
          	password: $scope.accountPage.mdp,
            rememberMe: false 
        }).then(function (result) {
        	if(!result.data){
        		alert(result);
        	} else {
        		var token = result.data.id_token
	        	Auth.getUserWithToken(token).then(function (result){
					$scope.user.identity = result.data;
					$scope.user.connect = true;
	        	});
        	}
        });
	};

	$scope.deconnexion = function(){
		$scope.user = {
			identity: {},
			connect: false
		};
	}

});
