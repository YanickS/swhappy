(function() {
    'use strict';

    angular
        .module('swhappyApp')
        .controller('SurveyController', SurveyController);

    SurveyController.$inject = ['$scope', '$state', 'Survey'];

    function SurveyController ($scope, $state, Survey) {
        var vm = this;
        
        vm.surveys = [];

        loadAll();

        function loadAll() {
            Survey.query(function(result) {
                vm.surveys = result;
            });
        }
    }
})();
