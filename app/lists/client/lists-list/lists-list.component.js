angular
    .module('movielist')
    .directive('mlListsList', listsListDirective);

function listsListDirective() {
    return {
        restrict: 'E',
        templateUrl: 'app/lists/client/lists-list/lists-list.html',
        controllerAs: 'listsListCtrl',
        controller: listsListController
    };
}

function listsListController($scope, $reactive) {
    const listsListCtrl = this;
    $reactive(listsListCtrl).attach($scope);
    listsListCtrl.subscribe('lists.user');
    listsListCtrl.helpers({
        lists
    });
    return;
    
    function lists() {
        return Lists.find();
    }
}