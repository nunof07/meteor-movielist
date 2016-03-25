angular
    .module('movielist')
    .config(homeRoutesConfig);

function homeRoutesConfig($stateProvider) {
    $stateProvider
        .state('home', {
            url: '/',
            template: '<ml-home></ml-home>',
            data: {
                title: i18n('home.title')
            }
        });
}