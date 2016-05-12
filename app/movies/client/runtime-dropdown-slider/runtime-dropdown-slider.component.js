angular
    .module('movielist')
    .directive('mlRuntimeDropdownSlider', runtimeDropdownSliderDirective);

function runtimeDropdownSliderDirective() {
    return {
        restrict: 'E',
        scope: {
            runtime: '=mlRuntime',
            range: '=mlRange'
        },
        bindToController: true,
        templateUrl: 'app/movies/client/runtime-dropdown-slider/runtime-dropdown-slider.html',
        controllerAs: 'runtimeDropdownSliderCtrl',
        controller: RuntimeDropdownSliderController
    };
}

function RuntimeDropdownSliderController($scope, $reactive, $timeout, mlRuntimeFilter) {
    const ctrl = this;
    $reactive(ctrl).attach($scope);
    
    ctrl.options = {
        floor: 0,
        ceil: 0,
        translate: formatSliderLabel,
        hideLimitLabels: true
    };
    
    ctrl.refreshSlider = refreshSlider;
    
    ctrl.autorun(updateOptions);
    return;
    
    function refreshSlider() {
        $timeout(refresh);
        return;
        
        function refresh() {
            $scope.$broadcast('rzSliderForceRender');
        }
    }
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