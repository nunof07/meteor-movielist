angular
    .module('movielist')
    .filter('mlTrustAsHtml', mlTrustAsHtmlFilter);

function mlTrustAsHtmlFilter($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
}