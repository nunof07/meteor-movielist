angular
    .module('movielist')
    .directive('mlSortButton', sortButtonDirective);

function sortButtonDirective() {
    return {
        restrict: 'E',
        scope: {
            label: '=mlLabel',
            value: '=mlValue',
            expression: '=mlExpression',
            isReverse: '=mlIsReverse',
        },
        bindToController: true,
        templateUrl: 'app/lib/client/sort-button/sort-button.html',
        controllerAs: 'sortButtonCtrl',
        controller: SortButtonController
    };
}

function SortButtonController($scope, $reactive) {
    const ctrl = this;
    $reactive(ctrl).attach($scope);
    
    ctrl.sort = sort;
    return;
    
    function sort() {
        ctrl.expression = ctrl.value;
        ctrl.isReverse = !ctrl.isReverse;
    }
}