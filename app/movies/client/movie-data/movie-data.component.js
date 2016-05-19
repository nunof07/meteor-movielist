angular
    .module('movielist')
    .directive('mlMovieData', movieDataDirective);

function movieDataDirective() {
    return {
        restrict: 'E',
        scope: {
            movie: '=mlMovie'
        },
        bindToController: true,
        templateUrl: 'app/movies/client/movie-data/movie-data.html',
        controllerAs: 'movieDataCtrl',
        controller: MovieDataController
    };
}

function MovieDataController($scope, $reactive) {
    const ctrl = this;
    $reactive(ctrl).attach($scope);
    return;
}