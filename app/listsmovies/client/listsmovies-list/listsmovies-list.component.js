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

function ListsMoviesListController($scope, $reactive, $timeout, logger, errorService) {
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
    ctrl.filter = {
        userScore: {
            min: 0,
            max: 5
        },
        movieScore: {
            min: 0,
            max: 5
        }
    };
    ctrl.genres = [];
    
    ctrl.deleteMovie = deleteMovie;
    ctrl.dismissError = dismissError;
    ctrl.getUserScore = getUserScore;
    ctrl.getMovieScore = getMovieScore;
    ctrl.clearGenresFilter = clearGenresFilter;
    ctrl.isMovieVisible = isMovieVisible;
    
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
        const movies = Movies.find({}, { sort: { title: 1 }});
        ctrl.genres = [];
        angular.forEach(movies, updateGenres);
        
        return movies;
        
        function updateGenres(movie) {
            angular.forEach(movie.genres, updateGenre);
            ctrl.genres = ctrl.genres.sort();
            return;
            
            function updateGenre(genre) {
                for (let i = 0; i < ctrl.genres.length; i++) {
                    if (ctrl.genres[i] === genre) {
                        return;
                    }
                }
                ctrl.genres.push(genre);
            }
        }
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
    function getUserScore(movie) {
        if (ctrl.userScores && ctrl.userScores.hasOwnProperty(movie._id)) {
            return ctrl.userScores[movie._id].score;
        } else {
            return 0;
        }
    }
    function getMovieScore(movie) {
        if (ctrl.moviesScores && ctrl.moviesScores.hasOwnProperty(movie._id)) {
            return ctrl.moviesScores[movie._id].average;
        } else {
            return 0;
        }
    }
    function clearGenresFilter() {
        ctrl.filter.genres = [];
    }
    function isMovieVisible(movie, index, movies) {
        if (ctrl.filter) {
            if (ctrl.filter.title && ctrl.filter.title.trim()) {
                if (!movieTitleContains(movie, ctrl.filter.title.trim())) {
                    return false;
                }
            }
            
            if (ctrl.filter.genres && ctrl.filter.genres.length) {
                if (!movieHasGenres(movie, ctrl.filter.genres)) {
                    return false;
                }
            }
            
            if (!userScoreWithin(ctrl.userScores[movie._id], ctrl.filter.userScore)) {
                return false;
            }
            
            if (!movieScoreWithin(ctrl.moviesScores[movie._id], ctrl.filter.movieScore)) {
                return false;
            }
        }
        
        return true;
        
        function movieTitleContains(movie, title) {
            const movieTitle = movie.title.toLowerCase();
            const compareTitle = title.toLowerCase();
            
            return (movieTitle.indexOf(compareTitle) > -1);
        }
        function movieHasGenres(movie, genres) {
            for (let i = 0; i < genres.length; i++) {
                let movieHasGenre = false;
                
                for (let j = 0; j < movie.genres.length; j++) {
                    if (movie.genres[j] === genres[i]) {
                        movieHasGenre = true;
                        break;
                    }
                }
                
                if (!movieHasGenre) {
                    return false;
                }
            }
            
            return true;
        }
        function userScoreWithin(userScore, filter) {
            const score = (userScore && userScore.score ? userScore.score : 0);
            
            return score >= filter.min && score <= filter.max;
        }
        function movieScoreWithin(movieScore, filter) {
            const score = (movieScore && movieScore.average ? movieScore.average : 0);
            
            return score >= filter.min && score <= filter.max;
        }
    }
}