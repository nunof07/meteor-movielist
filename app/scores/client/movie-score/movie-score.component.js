angular
    .module('movielist')
    .directive('mlMovieScore', movieScoreDirective);

function movieScoreDirective() {
    return {
        restrict: 'E',
        scope: {
            score: '=mlScore',
        },
        bindToController: true,
        templateUrl: 'app/scores/client/movie-score/movie-score.html',
        controllerAs: 'movieScoreCtrl',
        controller: MovieScoreController
    };
}

function MovieScoreController($scope, $reactive) {
    const ctrl = this;
    $reactive(ctrl).attach($scope);
    
    ctrl.autorun(starScore);
    return;
    
    function starScore() {
        const score = ctrl.getReactively('score') || 0;
        ctrl.starScore = Math.round(2 * score);
    }
}