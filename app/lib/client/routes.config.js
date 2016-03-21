angular
    .module('movielist')
    .config(routesConfig);

function routesConfig($urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
}