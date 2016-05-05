angular
    .module('movielist')
    .directive('mlMovieScoresList', movieScoresListDirective);

function movieScoresListDirective() {
    return {
        restrict: 'E',
        scope: {
            movie: '=mlMovie'
        },
        bindToController: true,
        templateUrl: 'app/scores/client/movie-scores-list/movie-scores-list.html',
        controllerAs: 'movieScoresListCtrl',
        controller: MovieScoresListController
    };
}

function MovieScoresListController($scope, $stateParams, $reactive) {
    const ctrl = this;
    $reactive(ctrl).attach($scope);
    ctrl.subscribe('movieScore.all', getMovieId);
    
    ctrl.users = [];
    
    ctrl.helpers({
        scores
    });
    
    ctrl.autorun(users);
    return;
    
    function getMovieId() {
        const movie = ctrl.getReactively('movie');
        
        if (movie) {
            return [{ movieId: movie._id }];
        } else {
            return [{ }];
        }
    }
    function scores() {
        return Scores.find({}, { sort: { modifiedAt: 1 }});
    }
    function users() {
        ctrl.users = [];
        const users = Meteor.users.find();
        angular.forEach(users, updateUser);
        return;
        
        function updateUser(user) {
            ctrl.users[user._id] = user;
        }
    }
}