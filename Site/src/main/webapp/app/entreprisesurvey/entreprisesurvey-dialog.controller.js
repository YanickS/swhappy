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
        vm.survey = {};

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }
        
        if($stateParams.idSurvey){
        	vm.survey = Survey.get({id: $stateParams.idSurvey});
        }

        function save () {
            vm.isSaving = true;
            if($stateParams.idSurvey){
            	Survey.update(vm.survey, onSaveSuccess, onSaveError);
            } else {
	            Entreprise.get({id:$stateParams.idEntreprise}, function success(result){
	        		vm.survey.entreprise = result;
	                Survey.save(vm.survey, onSaveSuccess, onSaveError);
	        	});
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
