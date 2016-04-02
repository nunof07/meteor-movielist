angular
    .module('movielist')
    .filter('mlYear', yearFilter);

function yearFilter() {
    return filter;
    
    function filter(date) {
        if (date) {
            if (angular.isString(date)) {
                date = new Date(date);
            }
            
            if (angular.isDate(date)) {
                return date.getFullYear();
            }
        }
        
        return date;
    }
}