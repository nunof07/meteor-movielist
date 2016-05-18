angular
    .module('movielist')
    .directive('mlMovieCard', movieCardDirective);

function movieCardDirective() {
    return {
        restrict: 'E',
        scope: {
            movie: '=mlMovie',
            userScore: '=mlUserScore',
            movieScore: '=mlMovieScore',
        },
        bindToController: true,
        templateUrl: 'app/movies/client/movie-card/movie-card.html',
        controllerAs: 'movieCardCtrl',
        controller: MovieCardController
    };
}

function MovieCardController($scope, $reactive) {
    const ctrl = this;
    $reactive(ctrl).attach($scope);
    return;
}