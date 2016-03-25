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

function ListDetailsController($scope, $stateParams, $reactive, titleService, modalService) {
    const listDetailsCtrl = this;
    $reactive(listDetailsCtrl).attach($scope);
    listDetailsCtrl.subscribe('listDetails.user', getListId);
    listDetailsCtrl.autorun(list);
    listDetailsCtrl.editList = editList;
    return;
    
    function list() {
        listDetailsCtrl.list = Lists.findOne({ _id: $stateParams.listId });
        
        if (listDetailsCtrl.list) {
            titleService.setTitle(listDetailsCtrl.list.name);
        }
    }
    function getListId() {
        return [{ listId: $stateParams.listId }];
    }
    function editList() {
        modalService.open('<ml-edit-list></ml-edit-list>',
            $scope,
            { list: listDetailsCtrl.list });
    }
}