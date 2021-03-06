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

function ListsMoviesViewController($scope, $reactive, $stateParams, logger, errorService, MoviePicker, modalService) {
    const ctrl = this;
    $reactive(ctrl).attach($scope);
    
    ctrl.view = ctrl;
    ctrl.selected = 'list';
    ctrl.movies = [];
    ctrl.userScores = [];
    ctrl.moviesScores = [];
    ctrl.error = false;
    ctrl.errorMessage = false;
    ctrl.isSubmitting = false;
    ctrl.isLoading = false;
    ctrl.sort = {
        expression: 'title',
        isReverse: false
    };
    ctrl.filter = {
        title: '',
        userScore: { min: 0, max: 5 },
        movieScore: { min: 0, max: 5 },
        runtime: { min: 0, max: void 0 },
        genres: []
    };
    ctrl.genres = [];
    ctrl.runtimes = { floor: 0, ceil: 0 };
    ctrl.previousQuery = {};
    ctrl.paging = {
        current: 1,
        count: 1,
        range: [1]
    };
    ctrl.filteredCount = 0;
    ctrl.totalCount = 0;
    
    ctrl.deleteMovie = deleteMovie;
    ctrl.dismissError = dismissError;
    ctrl.getUserScore = getUserScore;
    ctrl.getMovieScore = getMovieScore;
    ctrl.pickMovie = pickMovie;
    ctrl.onMovieAdded = onMovieAdded;
    ctrl.load = load;
    ctrl.goToPage = goToPage;
    ctrl.reload = reload;

    ctrl.autorun(autoload);
    return;
    
    function goToPage(page) {
        page = Math.floor(page);

        if (page > 0 && page <= ctrl.paging.count) {
            ctrl.paging.current = page;
            load(ctrl.list, ctrl.filter, ctrl.sort, page);
        }
    }
    function getQuery(listId, filter, sort) {
        return {
            listId: listId,
            title: filter.title,
            genres: filter.genres,
            runtimeMin: filter.runtime.min,
            runtimeMax: filter.runtime.max,
            userScoreMin: filter.userScore.min,
            userScoreMax: filter.userScore.max,
            movieScoreMin: filter.movieScore.min,
            movieScoreMax: filter.movieScore.max,
            sortExpression: sort.expression,
            sortIsReverse: sort.isReverse,
        };
    }
    function autoload() {
        const list = ctrl.getReactively('list');
        const filter = ctrl.getReactively('filter', true);
        const sort = ctrl.getReactively('sort', true);
        ctrl.paging.current = 1;
        load(list, filter, sort, ctrl.paging.current);
    }
    function reload() {
        load(ctrl.list, ctrl.filter, ctrl.sort, ctrl.paging.current);
    }
    function load(list, filter, sort, page) {
        const pageSize = 12;

        if (list && filter) {
            const query = getQuery(list._id, filter, sort);
            query.skip = Math.max((page - 1) * pageSize, 0);
            query.limit = pageSize;

            if (shouldLoad(query)) {
                ctrl.isLoading = true;
                ListsMovies.methods.fetch.call(query, fetchResult);
            }
            ctrl.previousQuery = angular.copy(query);
        }
        return;
        
        function fetchResult(error, result) {
            if (error) {
                logger.error('Error fetching movies', error);
                ctrl.error = {fetchFailed: true};
                ctrl.errorMessage = errorService.getErrorMessage(error);
            } else {
                ctrl.movies = result.filtered.movies;
                ctrl.userScores = result.filtered.userScores;
                ctrl.moviesScores = result.filtered.movieScores;
                ctrl.genres = result.range.genres;
                ctrl.runtimes = result.range.runtime;
                ctrl.filteredCount = result.filtered.count;
                ctrl.totalCount = result.range.count;
                updateFilterRuntime();
                updatePagination(result.filtered.count, pageSize);
            }
            ctrl.isLoading = false;
            $scope.$apply();
        }
        function shouldLoad(query) {
            const previousQueryCopy = angular.copy(ctrl.previousQuery);
            previousQueryCopy.runtimeMin = query.runtimeMin;
            previousQueryCopy.runtimeMax = query.runtimeMax;

            if (angular.equals(query, previousQueryCopy) &&
            !isRuntimeDefined(ctrl.previousQuery) &&
            isRuntimeDefined(query)) {
                // if the only thing that changed was the runtime
                // and it change from undefined to defined
                // then ignore it
                // we do this check because the runtime is set after load
                // and we want to avoid calling load twice
                return false;
            }

            return true;

            function isRuntimeDefined(query) {
                return query.runtimeMin && query.runtimeMax;
            }
        }
    }
    function updatePagination(count, pageSize) {
        ctrl.paging.count = Math.ceil(count / pageSize);

        if (ctrl.paging.current > ctrl.paging.count) {
            ctrl.paging.current = ctrl.paging.count;
        }
        const pagingCount = Math.min(5, ctrl.paging.count);
        const pagingStart = Math.min(
            Math.max(1, ctrl.paging.current - Math.floor(pagingCount / 2)),
            ctrl.paging.count - pagingCount + 1);
        ctrl.paging.range = _.range(pagingStart, pagingStart + pagingCount);
    }
    function updateFilterRuntime() {
        if (isRuntimesDefined()) {
            if (!ctrl.filter.runtime.min || ctrl.runtimes.floor > ctrl.filter.runtime.min) {
                ctrl.filter.runtime.min = ctrl.runtimes.floor;
            }
            
            if (!ctrl.filter.runtime.max || ctrl.runtimes.ceil < ctrl.filter.runtime.max) {
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
        const userScore = getUserScoreObject(movie);
        
        return (userScore ? userScore.score : 0);

        function getUserScoreObject(movie) {
            if (ctrl.userScores && ctrl.userScores.hasOwnProperty(movie._id)) {
                return ctrl.userScores[movie._id];
            } else {
                return null;
            }
        }
    }
    function getMovieScore(movie) {
        const movieScore = getMovieScoreObject(movie);
        
        return (movieScore ? movieScore.average : 0);
        
        function getMovieScoreObject(movie) {
            if (ctrl.moviesScores && ctrl.moviesScores.hasOwnProperty(movie._id)) {
                return ctrl.moviesScores[movie._id];
            } else {
                return null;
            }
        }
    }
    function pickMovie() {
        if (ctrl.list) {
            const query = getQuery(ctrl.list._id, ctrl.filter, ctrl.sort);
            ListsMovies.methods.fetch.call(query, fetchResult);
        }
        return;
        
        function fetchResult(error, result) {
            if (error) {
                logger.error('Error fetching movies for movie picker', error);
            } else {
                const picker = new MoviePicker({
                    movies: result.filtered.movies,
                    userScores: result.filtered.userScores,
                    movieScores: result.filtered.movieScores
                });
                modalService.open(
                    {
                        template: '<ml-movie-picker-dialog></ml-movie-picker-dialog>',
                        size: 'lg'
                    },
                    $scope,
                    { picker });
            }
        }
    }
}