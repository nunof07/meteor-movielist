angular
    .module('movielist')
    .config(aboutRoutes);

function aboutRoutes($stateProvider) {
    $stateProvider
        .state('about', {
            url: '/about',
            template: '<ml-about></ml-about>',
            data: {
                title: i18n('about.title')
            }
        });
}