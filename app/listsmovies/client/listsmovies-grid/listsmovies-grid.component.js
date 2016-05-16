angular
    .module('movielist')
    .directive('mlListsmoviesGrid', listsMoviesGridDirective);

function listsMoviesGridDirective() {
    return {
        restrict: 'E',
        scope: {
            view: '=mlView'
        },
        bindToController: true,
        templateUrl: 'app/listsmovies/client/listsmovies-grid/listsmovies-grid.html',
        controllerAs: 'listsMoviesGridCtrl',
        controller: ListsMoviesGridController
    };
}

function ListsMoviesGridController($scope, $reactive) {
    const ctrl = this;
    $reactive(ctrl).attach($scope);
    return;
}