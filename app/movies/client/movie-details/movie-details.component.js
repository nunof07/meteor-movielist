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

function MovieDetailsController($scope, $stateParams, $reactive, $sce, titleService) {
    const ctrl = this;
    $reactive(ctrl).attach($scope);
    ctrl.subscribe('movieDetails.user', getMovieId);
    ctrl.subscribe('movieScores.movie', getMovieId);
    ctrl.subscribe('movieScore.user', getMovieId);
    
    ctrl.autorun(movie);
    ctrl.autorun(scores);
    ctrl.autorun(userScore);
    return;
    
    function movie() {
        ctrl.movie = Movies.findOne({ _id: $stateParams.movieId });
        ctrl.hasOriginalTitle = hasOriginalTitle();
        ctrl.youTubeUrl = getYouTubeUrl();
        
        if (ctrl.movie) {
            titleService.setTitle(ctrl.movie.title);
        }
        return;
        
        function hasOriginalTitle() {
            return ctrl.movie &&
            ctrl.movie.originalTitle &&
            ctrl.movie.originalTitle !== ctrl.movie.title;
        }
        function getYouTubeUrl() {
            if (!ctrl.movie || !ctrl.movie.trailerYouTubeId) {
                return '';
            } else {
                const youTubeUrl = 'https://www.youtube.com/embed/' + ctrl.movie.trailerYouTubeId;
                return $sce.trustAsResourceUrl(youTubeUrl);
            }
        }
    }
    function scores() {
        ctrl.scores = MovieScores.findOne({ movieId: $stateParams.movieId });
    }
    function userScore() {
        if (Meteor.userId()) {
            ctrl.userScore = Scores.findOne({
                userId: Meteor.userId(),
                movieId: $stateParams.movieId});
        } else {
            ctrl.userScore = null;
        }
    }
    function getMovieId() {
        return [{ movieId: $stateParams.movieId }];
    }
}