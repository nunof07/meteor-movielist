angular
    .module('movielist')
    .config(movieDetailsRoutes);

function movieDetailsRoutes($stateProvider) {
    $stateProvider
        .state('movieDetails', {
            url: '/movies/:movieId',
            template: '<ml-movie-details></ml-movie-details>',
            resolve: {
                user: user
            }
        });
    return;
    
    function user($q) {
        if (!Meteor.userId()) {
            return $q.reject('AUTH_REQUIRED');
        } else {
            return $q.resolve(Meteor.user());
        }
    }
}