angular
    .module('movielist')
    .service('errorService', errorService);

function errorService() {
    this.getErrorMessage = getErrorMessage;
    return;
    
    function getErrorMessage(err) {
        if (angular.isObject(err) && err.reason) {
            return err.reason;
        } else {
            return '' + err;
        }
    }
}