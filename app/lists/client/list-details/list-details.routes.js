angular
    .module('movielist')
    .config(listsDetailsRoutes);

function listsDetailsRoutes($stateProvider) {
    $stateProvider
        .state('listDetails', {
            url: '/lists/:listId',
            template: '<ml-list-details></ml-list-details>',
            resolve: {
                isAuthorized: isAuthorized
            }
        });
    return;
    
    function isAuthorized($q, $stateParams, logger) {
        const defer = $q.defer();
        Lists.methods.hasAccess.call({
            listId: $stateParams.listId
        }, hasAccessResult);
        return defer.promise;
        
        function hasAccessResult(err, res) {
            if (err) {
                logger.error('Error checking authorization', err);
            }

            if (!err && res === true) {
                defer.resolve();
            } else {
                defer.reject('AUTH_ERROR');
            }
        }
    }
}