angular
    .module('movielist')
    .filter('mlI18n', mlI18nFilter);

function mlI18nFilter(i18nService) {
    return i18nService.get;
}