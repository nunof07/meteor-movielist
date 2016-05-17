angular
    .module('movielist')
    .directive('mlMovieFiltersDropdown', movieFiltersDropdownDirective);

function movieFiltersDropdownDirective() {
    return {
        restrict: 'E',
        scope: {
            filter: '=mlFilter',
            genres: '=mlGenres',
            runtimes: '=mlRuntimes'
        },
        bindToController: true,
        templateUrl: 'app/movies/client/movie-filters-dropdown/movie-filters-dropdown.html',
        controllerAs: 'movieFiltersDropdownCtrl',
        controller: MovieFiltersDropdownController
    };
}

function MovieFiltersDropdownController($scope, $reactive, $timeout) {
    const ctrl = this;
    $reactive(ctrl).attach($scope);
    
    ctrl.refreshSliders = refreshSliders;
    return;
    
    function refreshSliders() {
        $timeout(refresh);
        return;
        
        function refresh() {
            $scope.$broadcast('rzSliderForceRender');
        }
    }
}