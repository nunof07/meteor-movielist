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
    const ctrl = this;
    $reactive(ctrl).attach($scope);
    
    ctrl.list = angular.copy($scope.list);
    ctrl.name = $scope.list.name;
    ctrl.error = false;
    
    ctrl.updateList = updateList;
    ctrl.cancel = cancel;
    return;
    
    function updateList(list, done) {
        const data = {
            listId: ctrl.list._id,
            name: ctrl.list.name,
            isPublic: ctrl.list.isPublic
        };
        Lists.methods.update.call(data, updateListResult);
        return;
        
        function updateListResult(err, res) {
            if (err) {
                logger.error('Error updating list', err);
                ctrl.error = {saveFailed: true};
            } else {
                ctrl.cancel();
            }
            done();
        }
    }
    function cancel() {
        $scope.$close();
    }
}