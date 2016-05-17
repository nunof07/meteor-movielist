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

function RuntimeDropdownSliderController($scope, $reactive, $timeout) {
    const ctrl = this;
    $reactive(ctrl).attach($scope);
    
    ctrl.refreshSlider = refreshSlider;
    return;
    
    function refreshSlider() {
        $timeout(refresh);
        return;
        
        function refresh() {
            $scope.$broadcast('rzSliderForceRender');
        }
    }
}