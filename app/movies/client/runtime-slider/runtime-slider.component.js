angular
    .module('movielist')
    .directive('mlRuntimeSlider', runtimeSliderDirective);

function runtimeSliderDirective() {
    return {
        restrict: 'E',
        scope: {
            runtime: '=mlRuntime',
            range: '=mlRange'
        },
        bindToController: true,
        templateUrl: 'app/movies/client/runtime-slider/runtime-slider.html',
        controllerAs: 'runtimeSliderCtrl',
        controller: RuntimeSliderController
    };
}

function RuntimeSliderController($scope, $reactive, mlRuntimeFilter) {
    const ctrl = this;
    $reactive(ctrl).attach($scope);
    
    ctrl.options = {
        floor: 0,
        ceil: 0,
        translate: formatSliderLabel,
        hideLimitLabels: true
    };
    
    ctrl.autorun(updateOptions);
    return;
    
    function formatSliderLabel(value) {
        return mlRuntimeFilter(value);
    }
    function updateOptions() {
        const range = ctrl.getReactively('range');
        
        if (range) {
            if (range.floor) {
                ctrl.options.floor = range.floor;
            }
            
            if (range.ceil) {
                ctrl.options.ceil = range.ceil;
            }
        }
    }
}