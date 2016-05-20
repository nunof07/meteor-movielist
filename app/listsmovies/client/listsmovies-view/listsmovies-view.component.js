angular
    .module('movielist')
    .directive('mlListsmoviesView', listsMoviesViewDirective);

function listsMoviesViewDirective() {
    return {
        restrict: 'E',
        scope: {
            list: '=mlList'
        },
        bindToController: true,
        templateUrl: 'app/listsmovies/client/listsmovies-view/listsmovies-view.html',
        controllerAs: 'listsMoviesViewCtrl',
        controller: ListsMoviesViewController
    };
}

function ListsMoviesViewController($scope, $reactive, $timeout, $stateParams, logger, errorService, MoviePicker, modalService) {
    const ctrl = this;
    $reactive(ctrl).attach($scope);
    ctrl.subscribe('listsmovies.movies', getListId);
    
    ctrl.view = ctrl;
    ctrl.selected = 'list';
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
        },
        runtime: {
            min: 0,
            max: 0
        },
        genres: []
    };
    ctrl.genres = [];
    ctrl.runtimes = {
        floor: 0,
        ceil: 0
    };
    
    ctrl.deleteMovie = deleteMovie;
    ctrl.dismissError = dismissError;
    ctrl.getUserScore = getUserScore;
    ctrl.getMovieScore = getMovieScore;
    ctrl.isMovieVisible = isMovieVisible;
    ctrl.pickMovie = pickMovie;
    ctrl.onMovieAdded = onMovieAdded;
    
    ctrl.helpers({
        movies
    });
    
    ctrl.autorun(userScores);
    ctrl.autorun(moviesScores);
    return;
    
    function onMovieAdded(movieId) {
        ctrl.error = false;
        ctrl.errorMessage = false;
        const data = {
            listId: $stateParams.listId,
            movieId
        };
        ListsMovies.methods.insert.call(data, insertResult);
        return;
        
        function insertResult(error, result) {
            if (error) {
                ctrl.error = {addFailed: true};
                ctrl.errorMessage = errorService.getErrorMessage(error);
            }
        }
    }
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
        ctrl.runtimes = {};
        angular.forEach(movies, updateGenres);
        angular.forEach(movies, updateRuntimes);
        updateFilterRuntime();
        
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
        function updateRuntimes(movie) {
            if (movie.runtime) {
                if (!angular.isDefined(ctrl.runtimes.floor) || movie.runtime < ctrl.runtimes.floor) {
                    ctrl.runtimes.floor = movie.runtime;
                }
                
                if (!angular.isDefined(ctrl.runtimes.ceil) || movie.runtime > ctrl.runtimes.ceil) {
                    ctrl.runtimes.ceil = movie.runtime;
                }
            }
        }
        function updateFilterRuntime() {
            if (isRuntimesDefined()) {
                if (!ctrl.filter.runtime.min || ctrl.runtimes.floor < ctrl.filter.runtime.min) {
                    ctrl.filter.runtime.min = ctrl.runtimes.floor;
                }
                
                if (!ctrl.filter.runtime.max || ctrl.runtimes.ceil > ctrl.filter.runtime.max) {
                    ctrl.filter.runtime.max = ctrl.runtimes.ceil;
                }
            }
            return;
            
            function isRuntimesDefined() {
                return angular.isDefined(ctrl.runtimes) && 
                    angular.isDefined(ctrl.runtimes.floor) &&
                    !isNaN(ctrl.runtimes.floor) &&
                    angular.isDefined(ctrl.runtimes.ceil) &&
                    !isNaN(ctrl.runtimes.ceil);
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
    function getUserScoreObject(movie) {
        if (ctrl.userScores && ctrl.userScores.hasOwnProperty(movie._id)) {
            return ctrl.userScores[movie._id];
        } else {
            return null;
        }
    }
    function getMovieScoreObject(movie) {
        if (ctrl.moviesScores && ctrl.moviesScores.hasOwnProperty(movie._id)) {
            return ctrl.moviesScores[movie._id];
        } else {
            return null;
        }
    }
    function getUserScore(movie) {
        const userScore = getUserScoreObject(movie);
        
        return (userScore ? userScore.score : 0);
    }
    function getMovieScore(movie) {
        const movieScore = getMovieScoreObject(movie);
        
        return (movieScore ? movieScore.average : 0);
    }
    function isMovieVisible(movie, index, movies) {
        if (ctrl.filter) {
            if (!isMovieVisibleByTitle(movie, ctrl.filter.title)) {
                return false;
            }
            
            if (!isMovieVisibleByGenres(movie, ctrl.filter.genres)) {
                return false;
            }
            
            if (!userScoreWithin(ctrl.userScores[movie._id], ctrl.filter.userScore)) {
                return false;
            }
            
            if (!movieScoreWithin(ctrl.moviesScores[movie._id], ctrl.filter.movieScore)) {
                return false;
            }
            
            if (!movieRuntimeWithin(movie, ctrl.filter.runtime)) {
                return false;
            }
        }
        
        return true;
        
        function isMovieVisibleByTitle(movie, title) {
            if (title && title.trim()) {
                if (!movieTitleContains(movie, title.trim())) {
                    return false;
                }
            }
            return true;
            
            function movieTitleContains(movie, title) {
                const movieTitle = movie.title.toLowerCase();
                const compareTitle = title.toLowerCase();
                
                return (movieTitle.indexOf(compareTitle) > -1);
            }
        }
        function isMovieVisibleByGenres(movie, genres) {
            if (genres && genres.length) {
                if (!movieHasGenres(movie, genres)) {
                    return false;
                }
            }
            return true;
            
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
        }
        function userScoreWithin(userScore, filter) {
            const score = (userScore && userScore.score ? userScore.score : 0);
            
            return score >= filter.min && score <= filter.max;
        }
        function movieScoreWithin(movieScore, filter) {
            const score = (movieScore && movieScore.average ? movieScore.average : 0);
            
            return score >= filter.min && score <= filter.max;
        }
        function movieRuntimeWithin(movie, filter) {
            return movie.runtime >= filter.min && movie.runtime <= filter.max;
        }
    }
    function pickMovie() {
        const movies = getMovies();
        const picker = new MoviePicker(movies, getUserScoreObject, getMovieScoreObject);
        
        modalService.open(
            {
                template: '<ml-movie-picker-dialog></ml-movie-picker-dialog>',
                size: 'lg'
            },
            $scope,
            { picker });
        return;
        
        function getMovies() {
            const movies = Movies.find();
            const visible = [];
            angular.forEach(movies, processMovie);
            
            return visible;
            
            function processMovie(movie) {
                if (isMovieVisible(movie)) {
                    visible.push(movie);
                }
            }
        }
    }
}