angular
    .module('movielist')
    .config(animateConfig);

function animateConfig($animateProvider) {
    $animateProvider.classNameFilter(/^((?!(icon)).)*$/);
}