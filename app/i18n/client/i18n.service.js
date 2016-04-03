angular
    .module('movielist')
    .service('i18nService', i18nService);

function i18nService() {
    this.get = get;
    return;
    
    function get(key, params) {
        const args = getArgs(key, params);
        return i18n.apply(null, args);
        
        function getArgs(key, params) {
            if (angular.isUndefined(params)) {
                if (!angular.isArray(key)) {
                    key = [key];
                }
                return key;
            } else {
                if (!angular.isArray(params)) {
                    params = [params];
                }
                return [key].concat(params);
            }
        }
    }
}