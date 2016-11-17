(function() {
    'use strict';

    angular
        .module('swhappyApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('entreprise', {
            parent: 'entity',
            url: '/entreprise',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'swhappyApp.entreprise.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/entreprise/entreprises.html',
                    controller: 'EntrepriseController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('entreprise');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('entreprise-detail', {
            parent: 'entity',
            url: '/entreprise/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'swhappyApp.entreprise.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/entreprise/entreprise-detail.html',
                    controller: 'EntrepriseDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('entreprise');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Entreprise', function($stateParams, Entreprise) {
                    return Entreprise.get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'entreprise',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('entreprise-detail.edit', {
            parent: 'entreprise-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/entreprise/entreprise-dialog.html',
                    controller: 'EntrepriseDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Entreprise', function(Entreprise) {
                            return Entreprise.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('entreprise.new', {
            parent: 'entreprise',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/entreprise/entreprise-dialog.html',
                    controller: 'EntrepriseDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                siret: null,
                                name: null,
                                activity: null,
                                city: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('entreprise', null, { reload: 'entreprise' });
                }, function() {
                    $state.go('entreprise');
                });
            }]
        })
        .state('entreprise.edit', {
            parent: 'entreprise',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/entreprise/entreprise-dialog.html',
                    controller: 'EntrepriseDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Entreprise', function(Entreprise) {
                            return Entreprise.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('entreprise', null, { reload: 'entreprise' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('entreprise.delete', {
            parent: 'entreprise',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/entreprise/entreprise-delete-dialog.html',
                    controller: 'EntrepriseDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Entreprise', function(Entreprise) {
                            return Entreprise.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('entreprise', null, { reload: 'entreprise' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
