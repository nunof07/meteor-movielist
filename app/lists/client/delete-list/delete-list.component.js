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
    const ctrl = this;
    $reactive(ctrl).attach($scope);
    
    ctrl.list = $scope.list;
    ctrl.error = false;
    ctrl.isSubmitting = false;
    
    ctrl.deleteList = deleteList;
    ctrl.close = close;
    return;
    
    function deleteList() {
        ctrl.error = false;
        ctrl.isSubmitting = true;
        const data = {
            listId: ctrl.list._id
        };
        Lists.methods.delete.call(data, deleteListResult);
        return;
        
        function deleteListResult(err, res) {
            ctrl.isSubmitting = false;
            
            if (err) {
                logger.error('Error delete list', err);
                ctrl.error = {deleteFailed: true};
            } else {
                $scope.$close(true);
            }
        }
    }
    function close() {
        $scope.$close(false);
    }
}