angular
    .module('movielist')
    .directive('mlHome', homeDirective);

function homeDirective() {
    return {
        restrict: 'E',
        templateUrl: 'app/home/client/home.html',
        controllerAs: 'homeCtrl',
        controller: HomeController
    };
}

function HomeController($scope, $reactive, modalService) {
    const homeCtrl = this;
    homeCtrl.newList = newList;
    $reactive(homeCtrl).attach($scope);
    return;
    
    function newList() {
        modalService.open('<ml-add-list></ml-add-list>');
    }
}