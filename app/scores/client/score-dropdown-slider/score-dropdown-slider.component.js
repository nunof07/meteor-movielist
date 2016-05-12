angular
    .module('movielist')
    .directive('mlScoreDropdownSlider', scoreDropdownSliderDirective);

function scoreDropdownSliderDirective() {
    return {
        restrict: 'E',
        scope: {
            score: '=mlScore'
        },
        bindToController: true,
        templateUrl: 'app/scores/score-dropdown-slider/score-dropdown-slider/score-dropdown-slider.html',
        controllerAs: 'scoreDropdownSliderCtrl',
        controller: ScoreDropdownSliderController
    };
}

function ScoreDropdownSliderController($scope, $reactive, $timeout) {
    const ctrl = this;
    $reactive(ctrl).attach($scope);
    
    ctrl.options = {
        floor: 0,
        ceil: 5,
        showTicks: true,
        hideLimitLabels: true,
        hidePointerLabels: true,
        vertical: true
    };
    
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