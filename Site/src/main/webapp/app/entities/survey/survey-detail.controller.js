(function() {
    'use strict';

    angular
        .module('swhappyApp')
        .controller('SurveyDetailController', SurveyDetailController);

    SurveyDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'Survey', 'Question'];

    function SurveyDetailController($scope, $rootScope, $stateParams, previousState, entity, Survey, Question) {
        var vm = this;

        vm.survey = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('swhappyApp:surveyUpdate', function(event, result) {
            vm.survey = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
