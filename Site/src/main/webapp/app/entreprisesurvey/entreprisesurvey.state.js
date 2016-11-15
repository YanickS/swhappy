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
            url: '/create_survey',
            data: {
                authorities: ['ROLE_ENTREPRISE'],
                pageTitle: 'swhappyApp.question.home.title'
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
                    $translatePartialLoader.addPart('question');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
    }

})();
