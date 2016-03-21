angular
    .module('movielist')
    .config(routesConfig);

function routesConfig($stateProvider) {
    $stateProvider
        .state('home', {
            url: '/',
            template: '<ml-home></ml-home>',
            data: {
                title: 'Home'
            }
        });
}