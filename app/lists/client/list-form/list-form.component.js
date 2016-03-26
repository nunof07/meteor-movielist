angular
    .module('movielist')
    .directive('mlListForm', listFormDirective);

function listFormDirective() {
    return {
        restrict: 'E',
        scope: {
            onSubmit: '=mlOnSubmit',
            onCancel: '=mlOnCancel',
            list: '=mlList',
            title: '=mlTitle',
            error: '=mlError'
        },
        bindToController: true,
        templateUrl: 'app/lists/client/list-form/list-form.html',
        controllerAs: 'listFormCtrl',
        controller: ListFormController
    };
}

function ListFormController($scope, $reactive) {
    const ctrl = this;
    $reactive(ctrl).attach($scope);
    
    ctrl.isSubmitting = false;
    
    ctrl.submit = submit;
    ctrl.cancel = cancel;
    return;
    
    function submit() {
        if (angular.isFunction(ctrl.onSubmit)) {
            ctrl.error = false;
            ctrl.isSubmitting = true;
            ctrl.onSubmit(ctrl.list, submitDone);
        }
        return;
        
        function submitDone() {
            ctrl.isSubmitting = false;
        }
    }
    function cancel() {
        if (angular.isFunction(ctrl.onCancel)) {
            ctrl.onCancel();
        }
    }
}