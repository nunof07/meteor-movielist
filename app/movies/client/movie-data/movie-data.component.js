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

function MovieDataController($scope, $reactive, logger) {
    const ctrl = this;
    $reactive(ctrl).attach($scope);
    
    ctrl.autorun(hasTrailer);
    return;
    
    function hasTrailer() {
        const movie = ctrl.getReactively('movie');
        
        if (movie) {
            Movies.methods.isYouTubeTrailerValid.call({ movieId: movie._id }, callResult);
        } else {
            ctrl.hasTrailer = false;
        }
        return;
        
        function callResult(error, result) {
            if (error) {
                logger.error('Error check if YouTube Trailer is valid', error);
                ctrl.hasTrailer = false;
            } else {
                ctrl.hasTrailer = result;
            }
            $scope.$apply();
        }
    }
}