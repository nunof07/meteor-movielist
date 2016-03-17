angular
    .module('movielist')
    .directive('mlHome', homeDirective);

function homeDirective() {
    return {
        restrict: 'E',
        templateUrl: 'app/home/client/home.html',
        controllerAs: 'home',
        controller: HomeController
    };
}

function HomeController($scope, $reactive) {
    $reactive(this).attach($scope);
}