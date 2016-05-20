angular
    .module('movielist')
    .directive('mlAbout', aboutDirective);

function aboutDirective() {
    return {
        restrict: 'E',
        templateUrl: 'app/about/client/about.html',
        controllerAs: 'aboutCtrl',
        controller: AboutController
    };
}

function AboutController($scope, $reactive) {
    const ctrl = this;
    $reactive(ctrl).attach($scope);
}