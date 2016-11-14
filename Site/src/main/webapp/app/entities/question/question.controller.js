(function() {
    'use strict';

    angular
        .module('swhappyApp')
        .controller('QuestionController', QuestionController);

    QuestionController.$inject = ['$scope', '$state', 'Question'];

    function QuestionController ($scope, $state, Question) {
        var vm = this;
        
        vm.questions = [];

        loadAll();

        function loadAll() {
            Question.query(function(result) {
                vm.questions = result;
            });
        }
    }
})();
