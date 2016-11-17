(function() {
    'use strict';

    angular
        .module('swhappyApp')
        .controller('SurveyDialogController', SurveyDialogController);

    SurveyDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Survey', 'Question', 'Entreprise'];

    function SurveyDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, Survey, Question, Entreprise) {
        var vm = this;

        vm.survey = entity;
        vm.clear = clear;
        vm.save = save;
        vm.questions = Question.query();
        vm.entreprises = Entreprise.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.survey.id !== null) {
                Survey.update(vm.survey, onSaveSuccess, onSaveError);
            } else {
                Survey.save(vm.survey, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('swhappyApp:surveyUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
