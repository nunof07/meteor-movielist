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
            icon: '=mlIcon'
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
    
    ctrl.autorun(iconClass);
    return;
    
    function sort() {
        ctrl.expression = ctrl.value;
        ctrl.isReverse = !ctrl.isReverse;
    }
    function iconClass() {
        const mlIcon = ctrl.getReactively('icon');
        const isReverse = ctrl.getReactively('isReverse');
        let icon = 'i-sort';
        
        switch (mlIcon) {
            case 'alpha':
            case 'amount':
                icon += '-' + mlIcon;
                break;
            default: break;
        }
        
        if (isReverse) {
            icon += '-desc';
        } else {
            icon += '-asc';
        }
        ctrl.iconClass = icon;
    }
}