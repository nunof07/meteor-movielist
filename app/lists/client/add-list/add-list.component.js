angular
    .module('movielist')
    .directive('mlAddList', addListDirective);

function addListDirective() {
    return {
        restrict: 'E',
        templateUrl: 'app/lists/client/add-list/add-list.html',
        controllerAs: 'addListCtrl',
        controller: AddListController
    };
}

function AddListController($scope, $reactive, logger) {
    const ctrl = this;
    $reactive(ctrl).attach($scope);
    
    ctrl.list = {
        name: '',
        isPublic: false
    };
    ctrl.error = false;
    
    ctrl.addList = addList;
    ctrl.cancel = cancel;
    return;
    
    function addList(list, done) {
        const data = {
            name: ctrl.list.name,
            isPublic: ctrl.list.isPublic
        };
        Lists.methods.insert.call(data, addListResult);
        return;
        
        function addListResult(err, res) {
            if (err) {
                logger.error('Error adding list', err);
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