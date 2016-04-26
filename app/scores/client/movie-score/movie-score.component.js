angular
    .module('movielist')
    .directive('mlMovieScore', movieScoreDirective);

function movieScoreDirective() {
    return {
        restrict: 'E',
        scope: {
            movie: '=mlMovie',
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
    ctrl.subscribe('movieScore.all', getMovieId);
    
    ctrl.total = 0;
    ctrl.count = 0;
    ctrl.average = 0;
    ctrl.starScore = 0;
    
    ctrl.autorun(updateCounts);
    return;
    
    function updateCounts() {
        ctrl.total = Counts.get('MovieScore.total');
        ctrl.count = Counts.get('MovieScore.count');
        
        if (ctrl.count) {
            ctrl.average = ctrl.total / ctrl.count;
            ctrl.starScore = Math.round(2 * ctrl.average);
        }
    }
    function getMovieId() {
        const movie = ctrl.getReactively('movie');
        
        if (movie) {
            return [{ movieId: movie._id }];
        } else {
            return [{ }];
        }
    }
}