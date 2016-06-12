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
        templateUrl: 'app/scores/client/score-dropdown-slider/score-dropdown-slider.html',
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
        vertical: true,
        onEnd: onEnd
    };
    ctrl.data = {};
    
    ctrl.refreshSlider = refreshSlider;

    ctrl.autorun(updateData);
    return;
    
    function refreshSlider() {
        $timeout(refresh);
        return;
        
        function refresh() {
            $scope.$broadcast('rzSliderForceRender');
        }
    }
    function onEnd() {
        ctrl.score.min = ctrl.data.min;
        ctrl.score.max = ctrl.data.max;
    }
    function updateData() {
        const score = ctrl.getReactively('score', true);
        ctrl.data.min = score.min;
        ctrl.data.max = score.max;
    }
}