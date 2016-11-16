(function() {
    'use strict';

    angular
        .module('swhappyApp')
        .controller('EntrepriseSurveyQuestionDialogController', EntrepriseSurveyQuestionDialogController);

    EntrepriseSurveyQuestionDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Question', 'Survey'];

    function EntrepriseSurveyQuestionDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, Question, Survey) {
        var vm = this;

        vm.question = entity;
        vm.clear = clear;
        vm.save = save;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            Survey.get({id:$stateParams.id}, function success(result){
        		vm.question.surveys = result;
        		vm.question.counter1 = 0;
        		vm.question.counter2 = 0;
                Question.save(vm.question, onSaveSuccess, onSaveError);
        	});
        }

        function onSaveSuccess (result) {
            $scope.$emit('swhappyApp:questionUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
