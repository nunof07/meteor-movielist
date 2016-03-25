angular
    .module('movielist')
    .run(routesRun);

function routesRun($rootScope, $state, $location, titleService) {
    $rootScope.$on('$stateChangeSuccess', onStateChangeSuccess);
    $rootScope.$on('$stateChangeError', onStateChangeError);
    return;
    
    function onStateChangeSuccess(previousRoute, currentRoute) {
        const hasTitle = currentRoute.data && currentRoute.data.title;
        const title = hasTitle ? currentRoute.data.title : '';
        titleService.setTitle(title);
    }
    function onStateChangeError(event, toState, toParams, fromState, fromParams, error) {
        if (error === 'AUTH_ERROR') {
            $state.go('home');
        }
    }
}