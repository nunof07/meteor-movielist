angular
    .module('movielist')
    .directive('mlVote', voteDirective);

function voteDirective() {
    return {
        restrict: 'E',
        scope: {
            movie: '=mlMovie',
        },
        bindToController: true,
        templateUrl: 'app/scores/client/vote/vote.html',
        controllerAs: 'voteCtrl',
        controller: VoteController
    };
}

function VoteController($scope, $reactive, logger, errorService) {
    const ctrl = this;
    $reactive(ctrl).attach($scope);
    
    ctrl.error = false;
    ctrl.errorMessage = false;
    
    ctrl.vote = vote;
    ctrl.dismissError = dismissError;
    return;
    
    function vote(score) {
        if (ctrl.movie && score >= 1 && score <= 5) {
            ctrl.error = false;
            ctrl.errorMessage = false;
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
            }
        }
    }
    function dismissError() {
        ctrl.error = false;
    }
}