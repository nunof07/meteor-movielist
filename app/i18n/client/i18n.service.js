angular
    .module('movielist')
    .service('i18nService', i18nService);

function i18nService() {
    this.get = get;
    return;
    
    function get(key, params) {
        if (angular.isUndefined(params)) {
            return i18n(key);
        } else {
            if (!angular.isArray(params)) {
                params = [params];
            }
            const args = [key].concat(params);
            
            return i18n.apply(null, args);
        }
    }
}