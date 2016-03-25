angular
    .module('movielist')
    .config(appRoutes);

function appRoutes($urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
}