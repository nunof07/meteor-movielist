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
    
    ctrl.error = false;
    ctrl.errorMessage = false;
    ctrl.isSubmitting = false;
    
    ctrl.deleteMovie = deleteMovie;
    ctrl.dismissError = dismissError;
    
    ctrl.helpers({
        movies
    });
    return;
    
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