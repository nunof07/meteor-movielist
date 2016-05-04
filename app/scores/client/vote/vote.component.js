angular
    .module('movielist')
    .directive('mlVote', voteDirective);

function voteDirective() {
    return {
        restrict: 'E',
        scope: {
            movie: '=mlMovie',
            score: '=mlScore'
        },
        bindToController: true,
        templateUrl: 'app/scores/client/vote/vote.html',
        controllerAs: 'voteCtrl',
        controller: VoteController
    };
}

function VoteController($scope, $reactive, $timeout, logger, errorService) {
    const ctrl = this;
    $reactive(ctrl).attach($scope);
    
    ctrl.error = false;
    ctrl.errorMessage = false;
    ctrl.isSubmitting = false;
    ctrl.starScore = 0;
    
    ctrl.vote = vote;
    ctrl.dismissError = dismissError;
    
    ctrl.autorun(starScore);
    return;
    
    function starScore() {
        const score = ctrl.getReactively('score');
        
        if (score) {
            ctrl.starScore = 2 * score.score;
        } else {
            ctrl.starScore = 0;
        }
    }
    function vote(score) {
        if (ctrl.movie && score >= 1 && score <= 5) {
            ctrl.error = false;
            ctrl.errorMessage = false;
            ctrl.isSubmitting = true;
            const data = {
                movieId: ctrl.movie._id,
                score
            };
            Scores.methods.vote.call(data, voteResult);
        }
        return;
        
        function voteResult(error, result) {
            if (error) {
                logger.error('Error saving vote', error);
                ctrl.error = {saveFailed: true};
                ctrl.errorMessage = errorService.getErrorMessage(error);
                $timeout(dismissError, 5000);
            }
            ctrl.isSubmitting = false;
        }
    }
    function dismissError() {
        ctrl.error = false;
    }
}