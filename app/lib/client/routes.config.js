angular
    .module('movielist')
    .config(routesConfig);

function routesConfig($urlRouterProvider, $stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $stateProvider
        .state('home', {
            url: '/',
            template: '<ml-home></ml-home>',
            data: {
                title: 'Home'
            }
        });

    $urlRouterProvider.otherwise('/');
}