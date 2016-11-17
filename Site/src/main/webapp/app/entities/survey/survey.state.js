(function() {
    'use strict';

    angular
        .module('swhappyApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('survey', {
            parent: 'entity',
            url: '/survey',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'swhappyApp.survey.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/survey/surveys.html',
                    controller: 'SurveyController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('survey');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('survey-detail', {
            parent: 'entity',
            url: '/survey/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'swhappyApp.survey.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/survey/survey-detail.html',
                    controller: 'SurveyDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('survey');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Survey', function($stateParams, Survey) {
                    return Survey.get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'survey',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('survey-detail.edit', {
            parent: 'survey-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/survey/survey-dialog.html',
                    controller: 'SurveyDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Survey', function(Survey) {
                            return Survey.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('survey.new', {
            parent: 'survey',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/survey/survey-dialog.html',
                    controller: 'SurveyDialogController',
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
                    $state.go('survey', null, { reload: 'survey' });
                }, function() {
                    $state.go('survey');
                });
            }]
        })
        .state('survey.edit', {
            parent: 'survey',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/survey/survey-dialog.html',
                    controller: 'SurveyDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Survey', function(Survey) {
                            return Survey.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('survey', null, { reload: 'survey' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('survey.delete', {
            parent: 'survey',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/survey/survey-delete-dialog.html',
                    controller: 'SurveyDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Survey', function(Survey) {
                            return Survey.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('survey', null, { reload: 'survey' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
