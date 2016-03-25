angular
    .module('movielist')
    .config(listsRoutesConfig);

function listsRoutesConfig($stateProvider) {
    $stateProvider
        .state('listDetails', {
            url: '/lists/:listId',
            template: '<ml-list-details></ml-list-details>',
            // data: {
            //     title: i18n('home.title')
            // },
            // resolve: {
            //     isAuthorized: ($q, $stateParams, logger) => {
            //         const defer = $q.defer();
                    
            //         // check if user is authorized
            //         Projects.methods.hasAccess.call({
            //             projectId: $stateParams.projectId,
            //             visitorId: Visitor.id()
            //         }, (err, res) => {
            //             if (err) {
            //                 logger.error('Error checking authorization', err);
            //             }

            //             if (!err && res === true) {
            //                 defer.resolve();
            //             } else {
            //                 defer.reject('AUTH_ERROR');
            //             }
            //         });

            //         return defer.promise;
            //     }
            // }
        });
}