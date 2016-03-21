angular
    .module('movielist')
    .service('modalService', modalService);

function modalService($uibModal) {
    this.open = open;
    return;
    
    function open(options, $scope, childScopeData) {
        if (angular.isString(options)) {
            options = {
                animation: true,
                template: options
            };
        }
        let modal = {};

        if (angular.isDefined($scope) && angular.isObject(childScopeData)) {
            const childScope = $scope.$new(true);
            angular.extend(childScope, childScopeData);
            
            options.scope = childScope;
            modal = $uibModal.open(options);
            modal.result.finally(() => {
                childScope.$destroy();
            });
        } else {
            modal = $uibModal.open(options);
        }
        
        return modal;
    }
}