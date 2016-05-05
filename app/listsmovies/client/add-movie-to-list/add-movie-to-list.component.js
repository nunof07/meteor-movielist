angular
    .module('movielist')
    .directive('mlAddMovieToList', addMovieToListDirective);

function addMovieToListDirective() {
    return {
        restrict: 'E',
        scope: {
            movie: '=mlMovie',
            error: '=mlError',
            errorMessage: '=mlErrorMessage'
        },
        bindToController: true,
        templateUrl: 'app/listsmovies/client/add-movie-to-list/add-movie-to-list.html',
        controllerAs: 'addMovieToListCtrl',
        controller: AddMovieToListController
    };
}

function AddMovieToListController($scope, $reactive, logger, errorService) {
    const ctrl = this;
    $reactive(ctrl).attach($scope);
    ctrl.subscribe('lists.user');
    
    ctrl.isSubmitting = false;
    ctrl.addToList = addToList;
    
    ctrl.helpers({
        lists
    });
    return;
    
    function lists() {
        return Lists.find({}, { sort: { name: 1 }});
    }
    function addToList(list) {
        if (!ctrl.isSubmitting) {
            ctrl.isSubmitting = true;
            const data = {
                listId: list._id,
                movieId: ctrl.movie._id
            };
            ListsMovies.methods.insert.call(data, insertResult);
        }
        return;
        
        function insertResult(error, result) {
            ctrl.isSubmitting = false;
            
            if (error) {
                ctrl.error = {addFailed: true};
                ctrl.errorMessage = errorService.getErrorMessage(error);
            }
            $scope.$apply();
        }
    }
}