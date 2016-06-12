angular
    .module('movielist')
    .directive('mlScoreHorizontalSlider', scoreHorizontalSliderDirective);

function scoreHorizontalSliderDirective() {
    return {
        restrict: 'E',
        scope: {
            score: '=mlScore'
        },
        bindToController: true,
        templateUrl: 'app/scores/client/score-horizontal-slider/score-horizontal-slider.html',
        controllerAs: 'scoreHorizontalSliderCtrl',
        controller: ScoreHorizontalSliderController
    };
}

function ScoreHorizontalSliderController($scope, $reactive, $timeout) {
    const ctrl = this;
    $reactive(ctrl).attach($scope);
    
    ctrl.options = {
        floor: 0,
        ceil: 5,
        showTicks: true,
        hideLimitLabels: true,
        translate: formatLabel,
        onEnd: onEnd
    };
    ctrl.data = {};

    ctrl.autorun(updateData);
    return;
    
    function formatLabel(value) {
        if (value === 0) {
            return '<span class="icon i-star-hollow"></span>';
        }
        
        return '<span class="icon i-star"></span>' +
            '<span class="value">' + value + '</span>';
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