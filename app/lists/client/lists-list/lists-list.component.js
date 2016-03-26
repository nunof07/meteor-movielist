angular
    .module('movielist')
    .directive('mlListsList', listsListDirective);

function listsListDirective() {
    return {
        restrict: 'E',
        templateUrl: 'app/lists/client/lists-list/lists-list.html',
        controllerAs: 'listsListCtrl',
        controller: ListsListController
    };
}

function ListsListController($scope, $reactive) {
    const ctrl = this;
    $reactive(ctrl).attach($scope);
    ctrl.subscribe('lists.user');
    
    ctrl.helpers({
        lists
    });
    return;
    
    function lists() {
        return Lists.find();
    }
}