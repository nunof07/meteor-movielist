angular
    .module('movielist')
    .directive('mlMoviePickerDialog', moviePickerDialogDirective);

function moviePickerDialogDirective() {
    return {
        restrict: 'E',
        templateUrl: 'app/listsmovies/client/movie-picker-dialog/movie-picker-dialog.html',
        controllerAs: 'moviePickerDialogCtrl',
        controller: MoviePickerDialogController
    };
}

function MoviePickerDialogController($scope, $reactive, logger, $timeout) {
    const ctrl = this;
    const picker = $scope.picker;
    $reactive(ctrl).attach($scope);
    
    ctrl.isLoading = false;
    ctrl.error = false;
    ctrl.errorMessage = '';
    
    ctrl.next = next;
    ctrl.close = close;
    ctrl.dismissError = dismissError;
    
    next();
    return;
    
    function next() {
        ctrl.isLoading = true;
        ctrl.error = false;
        picker.pick()
            .then(pickSuccess, pickFailure)
            .finally(pickFinally);
        return;
        
        function pickSuccess(pick) {
            ctrl.pick = pick;
        }
        function pickFailure(reason) {
            if (reason === 'noMovieFound') {
                ctrl.pick = {};
            } else {
                logger.error('Error picking next movie', reason);
                ctrl.error = true;
                ctrl.errorMessage = reason;
            }
        }
        function pickFinally() {
            ctrl.isLoading = false;
        }
    }
    function close() {
        $scope.$close();
    }
    function dismissError() {
        ctrl.error = false;
    }
}