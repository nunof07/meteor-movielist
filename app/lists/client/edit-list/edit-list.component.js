angular
    .module('movielist')
    .directive('mlEditList', editListDirective);

function editListDirective() {
    return {
        restrict: 'E',
        templateUrl: 'app/lists/client/edit-list/edit-list.html',
        controllerAs: 'editListCtrl',
        controller: EditListController
    };
}

function EditListController($scope, $reactive, logger) {
    const editListCtrl = this;
    $reactive(editListCtrl).attach($scope);
    editListCtrl.list = angular.copy($scope.list);
    editListCtrl.name = $scope.list.name;
    editListCtrl.error = false;
    editListCtrl.updateList = updateList;
    editListCtrl.cancel = cancel;
    return;
    
    function updateList(list, done) {
        const data = {
            listId: editListCtrl.list._id,
            name: editListCtrl.list.name,
            isPublic: editListCtrl.list.isPublic
        };
        Lists.methods.update.call(data, updateListResult);
        return;
        
        function updateListResult(err, res) {
            if (err) {
                logger.error('Error updating list', err);
                editListCtrl.error = {saveFailed: true};
            } else {
                editListCtrl.cancel();
            }
            done();
        }
    }
    function cancel() {
        $scope.$close();
    }
}