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
    ctrl.subscribe('movieScore.user', getMovieId);
    
    ctrl.error = false;
    ctrl.errorMessage = false;
    ctrl.score = 0;
    ctrl.starScore = 0;
    
    ctrl.vote = vote;
    ctrl.dismissError = dismissError;
    
    ctrl.autorun(scoreAutorun);
    return;
    
    function getMovieId() {
        const movie = ctrl.getReactively('movie');
        
        if (movie) {
            return [{ movieId: movie._id }];
        } else {
            return [{ }];
        }
    }
    function scoreAutorun() {
        const movie = ctrl.getReactively('movie');
        let updated = false;
        
        if (movie && Meteor.userId()) {
            const score = Scores.findOne({
                userId: Meteor.userId(),
                movieId: ctrl.movie._id});
                
            if (score) {
                ctrl.score = score.score;
                ctrl.starScore = 2 * ctrl.score;
                updated = true;
            }
        }
        
        if (!updated) {
            ctrl.score = 0;
            ctrl.starScore = 0;
        }
    }
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