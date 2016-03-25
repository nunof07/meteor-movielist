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
    const listFormCtrl = this;
    listFormCtrl.isSubmitting = false;
    listFormCtrl.submit = submit;
    listFormCtrl.cancel = cancel;
    $reactive(listFormCtrl).attach($scope);
    return;
    
    function submit() {
        if (angular.isFunction(listFormCtrl.onSubmit)) {
            listFormCtrl.error = false;
            listFormCtrl.isSubmitting = true;
            listFormCtrl.onSubmit(listFormCtrl.list, submitDone);
        }
        return;
        
        function submitDone() {
            listFormCtrl.isSubmitting = false;
        }
    }
    function cancel() {
        if (angular.isFunction(listFormCtrl.onCancel)) {
            listFormCtrl.onCancel();
        }
    }
}