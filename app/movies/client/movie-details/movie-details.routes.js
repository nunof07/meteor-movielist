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
    
    function user($auth) {
        return $auth.requireUser();
    }
}