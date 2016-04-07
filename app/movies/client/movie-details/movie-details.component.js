angular
    .module('movielist')
    .directive('mlMovieDetails', movieDetailsDirective);

function movieDetailsDirective() {
    return {
        restrict: 'E',
        templateUrl: 'app/movies/client/movie-details/movie-details.html',
        controllerAs: 'movieDetailsCtrl',
        controller: MovieDetailsController
    };
}

function MovieDetailsController($scope, $stateParams, $reactive, titleService) {
    const ctrl = this;
    $reactive(ctrl).attach($scope);
    ctrl.subscribe('movieDetails.user', getMovieId);
    
    ctrl.autorun(movie);
    return;
    
    function movie() {
        ctrl.movie = Movies.findOne({ _id: $stateParams.movieId });
        ctrl.hasOriginalTitle = hasOriginalTitle();
        
        if (ctrl.movie) {
            titleService.setTitle(ctrl.movie.title);
        }
        return;
        
        function hasOriginalTitle() {
            return ctrl.movie &&
            ctrl.movie.originalTitle &&
            ctrl.movie.originalTitle !== ctrl.movie.title;
        }
    }
    function getMovieId() {
        return [{ movieId: $stateParams.movieId }];
    }
}