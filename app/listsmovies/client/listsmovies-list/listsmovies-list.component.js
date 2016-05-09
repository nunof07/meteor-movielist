angular
    .module('movielist')
    .directive('mlListsmoviesList', listsMoviesListDirective);

function listsMoviesListDirective() {
    return {
        restrict: 'E',
        scope: {
            list: '=mlList'
        },
        bindToController: true,
        templateUrl: 'app/listsmovies/client/listsmovies-list/listsmovies-list.html',
        controllerAs: 'listsMoviesListCtrl',
        controller: ListsMoviesListController
    };
}

function ListsMoviesListController($scope, $reactive, logger, errorService) {
    const ctrl = this;
    $reactive(ctrl).attach($scope);
    ctrl.subscribe('listsmovies.movies', getListId);
    
    ctrl.userScores = [];
    ctrl.moviesScores = [];
    ctrl.error = false;
    ctrl.errorMessage = false;
    ctrl.isSubmitting = false;
    ctrl.sort = {
        expression: 'title',
        isReverse: false
    };
    
    ctrl.deleteMovie = deleteMovie;
    ctrl.dismissError = dismissError;
    
    ctrl.helpers({
        movies
    });
    
    ctrl.autorun(userScores);
    ctrl.autorun(moviesScores);
    return;
    
    function userScores() {
        ctrl.userScores = [];
        
        if (Meteor.userId()) {
            const scores = Scores.find({ userId: Meteor.userId() });
            angular.forEach(scores, updateUserScore);
        }
        return;
        
        function updateUserScore(score) {
            ctrl.userScores[score.movieId] = score;
        }
    }
    function moviesScores() {
        ctrl.moviesScores = [];
        const scores = MovieScores.find();
        angular.forEach(scores, updateMovieScores);
        return;
        
        function updateMovieScores(score) {
            ctrl.moviesScores[score.movieId] = score;
        }
    }
    function movies() {
        return Movies.find({}, { sort: { title: 1 }});
    }
    function getListId() {
        const list = ctrl.getReactively('list');
        
        if (list) {
            return [{ listId: list._id }];
        } else {
            return [{ }];
        }
    }
    function deleteMovie(movie) {
        if (!movie.isDeleting) {
            movie.isDeleting = true;
            ctrl.error = false;
            ctrl.errorMessage = false;
            ctrl.isSubmitting = true;
            const data = {
                listId: ctrl.list._id,
                movieId: movie._id
            };
            ListsMovies.methods.delete.call(data, deleteResult);
        }
        return;
        
        function deleteResult(err, res) {
            movie.isDeleting = false;
            ctrl.isSubmitting = false;
            
            if (err) {
                logger.error('Error deleting movie', err);
                ctrl.error = {deleteFailed: true};
                ctrl.errorMessage = errorService.getErrorMessage(err);
            }
        }
    }
    function dismissError() {
        ctrl.error = false;
    }
}