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
    const addListCtrl = this;
    addListCtrl.list = {
        name: '',
        isPublic: false
    };
    addListCtrl.error = false;
    addListCtrl.addList = addList;
    addListCtrl.cancel = cancel;
    $reactive(addListCtrl).attach($scope);
    return;
    
    function addList(list, done) {
        const data = {
            name: addListCtrl.list.name,
            isPublic: addListCtrl.list.isPublic
        };
        Lists.methods.insert.call(data, addListResult);
        return;
        
        function addListResult(err, res) {
            if (err) {
                logger.error('Error adding list', err);
                addListCtrl.error = {saveFailed: true};
            } else {
                addListCtrl.cancel();
            }
            done();
        }
    }
    function cancel() {
        $scope.$close();
    }
}