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
    const ctrl = this;
    $reactive(ctrl).attach($scope);
    ctrl.autorun(updateIsLoggedIn);
    
    ctrl.isLoggedIn = false;
    
    ctrl.newList = newList;
    return;
    
    function newList() {
        modalService.open('<ml-add-list></ml-add-list>');
    }
    function updateIsLoggedIn() {
        ctrl.isLoggedIn = !!Meteor.user();
    }
}