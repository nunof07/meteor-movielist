angular
    .module('movielist')
    .directive('mlMovieScore', movieScoreDirective);

function movieScoreDirective() {
    return {
        restrict: 'E',
        scope: {
            scores: '=mlScores',
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
        const scores = ctrl.getReactively('scores');
        
        if (scores && scores.average) {
            ctrl.starScore = Math.round(2 * scores.average);
        } else {
            ctrl.starScore = 0;
        }
    }
}