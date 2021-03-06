(function() {
    'use strict';

    angular
        .module('swhappyApp')
        .controller('RegisterController', RegisterController);


    RegisterController.$inject = ['$translate', '$timeout', 'Auth', 'LoginService', 'Entreprise'];

    function RegisterController ($translate, $timeout, Auth, LoginService, Entreprise) {
        var vm = this;

        vm.doNotMatch = null;
        vm.error = null;
        vm.errorUserExists = null;
        vm.login = LoginService.open;
        vm.register = register;
        vm.registerAccount = {};
        vm.success = null;
        vm.registerAccount.sexe = "Homme";
        
        vm.forEntreprise = false;

        $timeout(function (){angular.element('#login').focus();});

        function register () {
            if (vm.registerAccount.password !== vm.confirmPassword) {
                vm.doNotMatch = 'ERROR';
            } else {
                if(vm.forEntreprise){
                	Entreprise.save(vm.registerAccount.entreprise, function(result){
                		vm.registerAccount.entreprise = result;
                		createUser();
                    });
                } else { createUser(); }
            }
        }
        
        function createUser(){
        	vm.registerAccount.langKey = $translate.use();
            vm.doNotMatch = null;
            vm.error = null;
            vm.errorUserExists = null;
            vm.errorEmailExists = null;

            Auth.createAccount(vm.registerAccount).then(function () {
                vm.success = 'OK';
            }).catch(function (response) {
                vm.success = null;
                if (response.status === 400 && response.data === 'login already in use') {
                    vm.errorUserExists = 'ERROR';
                } else if (response.status === 400 && response.data === 'e-mail address already in use') {
                    vm.errorEmailExists = 'ERROR';
                } else {
                    vm.error = 'ERROR';
                }
            });
        }
    }
})();
