(function() {
    'use strict';

    angular
        .module('swhappyApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('entreprisesurvey', {
            parent: 'app',
            url: '/surveyManagement',
            data: {
                authorities: ['ROLE_ENTREPRISE'],
                pageTitle: 'swhappyApp.entreprisesurvey.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entreprisesurvey/entreprisesurvey.html',
                    controller: 'EntrepriseSurveyController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('entreprisesurvey');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('entreprisesurvey.new', {
            parent: 'entreprisesurvey',
            url: '/new/{id}',
            data: {
                authorities: ['ROLE_ENTREPRISE']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entreprisesurvey/entreprisesurvey-dialog.html',
                    controller: 'EntrepriseSurveyDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                title: null,
                                type: null,
                                points: null,
                                promo: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('entreprisesurvey', null, { reload: 'entreprisesurvey' });
                }, function() {
                    $state.go('entreprisesurvey');
                });
            }]
        })
    }

})();
