angular
    .module('movielist')
    .directive('mlDeleteList', deleteListDirective);

function deleteListDirective() {
    return {
        restrict: 'E',
        templateUrl: 'app/lists/client/delete-list/delete-list.html',
        controllerAs: 'deleteListCtrl',
        controller: DeleteListController
    };
}

function DeleteListController($scope, $reactive, $timeout, logger) {
    const deleteListCtrl = this;
    $reactive(deleteListCtrl).attach($scope);
    deleteListCtrl.list = $scope.list;
    deleteListCtrl.error = false;
    deleteListCtrl.isSubmitting = false;
    deleteListCtrl.deleteList = deleteList;
    deleteListCtrl.close = close;
    return;
    
    function deleteList() {
        deleteListCtrl.error = false;
        deleteListCtrl.isSubmitting = true;
        const data = {
            listId: deleteListCtrl.list._id
        };
        Lists.methods.delete.call(data, deleteListResult);
        return;
        
        function deleteListResult(err, res) {
            deleteListCtrl.isSubmitting = false;
            
            if (err) {
                logger.error('Error delete list', err);
                deleteListCtrl.error = {deleteFailed: true};
            } else {
                $scope.$close(true);
            }
        }
    }
    function close() {
        $scope.$close(false);
    }
}