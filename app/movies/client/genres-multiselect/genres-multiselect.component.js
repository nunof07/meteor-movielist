angular
    .module('movielist')
    .directive('mlGenresMultiselect', genresMultiselectDirective);

function genresMultiselectDirective() {
    return {
        restrict: 'E',
        scope: {
            filter: '=mlFilter',
            genres: '=mlGenres',
        },
        bindToController: true,
        templateUrl: 'app/movies/client/genres-multiselect/genres-multiselect.html',
        controllerAs: 'genresMultiselectCtrl',
        controller: GenresMultiselectController
    };
}

function GenresMultiselectController($scope, $reactive) {
    const ctrl = this;
    $reactive(ctrl).attach($scope);
    
    ctrl.clear = clear;
    return;
    
    function clear() {
        ctrl.filter = [];
    }
}