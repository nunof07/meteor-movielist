angular
    .module('movielist')
    .directive('mlListsmoviesList', listsMoviesListDirective);

function listsMoviesListDirective() {
    return {
        restrict: 'E',
        scope: {
            view: '=mlView'
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
    return;
}