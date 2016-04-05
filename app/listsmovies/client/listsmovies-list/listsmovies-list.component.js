angular
    .module('movielist')
    .directive('mlListsmoviesList', listsMoviesListDirective);

function listsMoviesListDirective() {
    return {
        restrict: 'E',
        scope: {
            list: '=mlList'
        },
        bindToController: true,
        templateUrl: 'app/listsmovies/client/listsmovies-list/listsmovies-list.html',
        controllerAs: 'listsMoviesListCtrl',
        controller: ListsMoviesListController
    };
}

function ListsMoviesListController($scope, $reactive) {
    const ctrl = this;
    $reactive(ctrl).attach($scope);
    ctrl.subscribe('listsmovies.movies', getListId);
    
    ctrl.helpers({
        movies
    });
    return;
    
    function movies() {
        return Movies.find({}, { sort: { title: 1 }});
    }
    function getListId() {
        const list = ctrl.getReactively('list');
        
        if (list) {
            return [{ listId: list._id }];
        } else {
            return [{ }];
        }
    }
}