angular
    .module('movielist')
    .directive('mlListDetails', listDetailsDirective);

function listDetailsDirective() {
    return {
        restrict: 'E',
        templateUrl: 'app/lists/client/list-details/list-details.html',
        controllerAs: 'listDetailsCtrl',
        controller: ListDetailsController
    };
}

function ListDetailsController($scope, $stateParams, $reactive, $state,
titleService, modalService, logger, errorService) {
    const ctrl = this;
    $reactive(ctrl).attach($scope);
    ctrl.subscribe('listDetails.user', getListId);
    
    ctrl.error = false;
    ctrl.errorMessage = false;
    
    ctrl.editList = editList;
    ctrl.deleteList = deleteList;
    ctrl.onMovieAdded = onMovieAdded;
    ctrl.dismissError = dismissError;
    
    ctrl.autorun(list);
    return;
    
    function list() {
        ctrl.list = Lists.findOne({ _id: $stateParams.listId });
        
        if (ctrl.list) {
            titleService.setTitle(ctrl.list.name);
        }
    }
    function getListId() {
        return [{ listId: $stateParams.listId }];
    }
    function editList() {
        modalService.open('<ml-edit-list></ml-edit-list>',
            $scope,
            { list: ctrl.list });
    }
    function deleteList() {
        const deleteModal = modalService.open('<ml-delete-list></ml-delete-list>',
            $scope,
            { list: ctrl.list });
        
        deleteModal.result.then(function (deleted) {
            if (deleted) {
                $state.go('home');
            }
        });
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
    function dismissError() {
        ctrl.error = false;
    }
}