angular
    .module('movielist')
    .directive('mlMovieLists', movieListsDirective);

function movieListsDirective() {
    return {
        restrict: 'E',
        scope: {
            movie: '=mlMovie'
        },
        bindToController: true,
        templateUrl: 'app/listsmovies/client/movie-lists/movie-lists.html',
        controllerAs: 'movieListsCtrl',
        controller: MovieListsController
    };
}

function MovieListsController($scope, $stateParams, $reactive, logger, errorService) {
    const ctrl = this;
    $reactive(ctrl).attach($scope);
    ctrl.subscribe('listsmovies.lists', getMovieId);
    
    ctrl.error = false;
    ctrl.errorMessage = false;
    ctrl.isSubmitting = false;
    
    ctrl.removeFromList = removeFromList;
    ctrl.dismissError = dismissError;
    
    ctrl.helpers({
        lists
    });
    return;
    
    function getMovieId() {
        const movie = ctrl.getReactively('movie');
        
        if (movie) {
            return [{ movieId: movie._id }];
        } else {
            return [{ }];
        }
    }
    function lists() {
        return MovieLists.find({}, { sort: { name: 1 }});
    }
    function removeFromList(list) {
        if (!list.isDeleting) {
            list.isDeleting = true;
            ctrl.error = false;
            ctrl.errorMessage = false;
            ctrl.isSubmitting = true;
            const data = {
                listId: list._id,
                movieId: ctrl.movie._id
            };
            ListsMovies.methods.delete.call(data, deleteResult);
        }
        return;
        
        function deleteResult(err, res) {
            list.isDeleting = false;
            ctrl.isSubmitting = false;
            
            if (err) {
                logger.error('Error removing movie from list', err);
                ctrl.error = {deleteFailed: true};
                ctrl.errorMessage = errorService.getErrorMessage(err);
            }
        }
    }
    function dismissError() {
        ctrl.error = false;
    }
}