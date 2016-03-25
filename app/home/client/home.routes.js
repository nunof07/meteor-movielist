angular
    .module('movielist')
    .config(homeRoutes);

function homeRoutes($stateProvider) {
    $stateProvider
        .state('home', {
            url: '/',
            template: '<ml-home></ml-home>',
            data: {
                title: i18n('home.title')
            }
        });
}