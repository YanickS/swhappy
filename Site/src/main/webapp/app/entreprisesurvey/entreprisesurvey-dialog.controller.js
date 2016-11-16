(function() {
    'use strict';

    angular
        .module('swhappyApp')
        .controller('EntrepriseSurveyDialogController', EntrepriseSurveyDialogController);

    EntrepriseSurveyDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'Survey', 'Entreprise'];

    function EntrepriseSurveyDialogController ($timeout, $scope, $stateParams, $uibModalInstance, Survey, Entreprise) {
        var vm = this;

        vm.clear = clear;
        vm.save = save;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            Entreprise.get({id:$stateParams.id}, function success(result){
        		vm.survey.entreprise = result;
                Survey.save(vm.survey, onSaveSuccess, onSaveError);
        	});
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
