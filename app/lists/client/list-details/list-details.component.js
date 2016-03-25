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

function ListDetailsController($scope, $stateParams, $reactive) {
    const listDetailsCtrl = this;
    $reactive(listDetailsCtrl).attach($scope);
    listDetailsCtrl.subscribe('listDetails.user', getListId);
    listDetailsCtrl.autorun(list);
    return;
    
    function list() {
        listDetailsCtrl.list = Lists.findOne({ _id: $stateParams.listId });
    }
    function getListId() {
        return [{ listId: $stateParams.listId }];
    }
}