(function() {
    'use strict';

    angular
        .module('swhappyApp')
        .controller('EntrepriseSurveyDialogController', EntrepriseSurveyDialogController);

    EntrepriseSurveyDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Survey', 'Question', 'Entreprise'];

    function EntrepriseSurveyDialogController ($timeout, $scope, $stateParams, $uibModalInstance, Survey) {
        var vm = this;

        vm.clear = clear;
        vm.save = save;

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            Survey.save(vm.survey, onSaveSuccess, onSaveError);
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
