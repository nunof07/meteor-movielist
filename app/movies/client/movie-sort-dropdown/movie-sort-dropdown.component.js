angular
    .module('movielist')
    .directive('mlMovieSortDropdown', movieSortDropdownDirective);

function movieSortDropdownDirective() {
    return {
        restrict: 'E',
        scope: {
            sort: '=mlSort',
            userScore: '=mlUserScore',
            movieScore: '=mlMovieScore'
        },
        bindToController: true,
        templateUrl: 'app/movies/client/movie-sort-dropdown/movie-sort-dropdown.html',
        controllerAs: 'movieSortDropdownCtrl',
        controller: MovieSortDropdownController
    };
}

function MovieSortDropdownController($scope, $reactive, $timeout) {
    const ctrl = this;
    $reactive(ctrl).attach($scope);
    return;
}