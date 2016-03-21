angular
    .module('movielist')
    .run(routesRun);

function routesRun($rootScope, $state, $timeout) {
    $rootScope.$on('$stateChangeSuccess', onStateChangeSuccess);
    return;
    
    function onStateChangeSuccess(previousRoute, currentRoute) {
        const hasTitle = currentRoute.data && currentRoute.data.title;
        const title = hasTitle ? currentRoute.data.title : '';
        const defaultTitle = i18n('siteName');
        document.title = defaultTitle + (hasTitle ? ' | ' + title : '');
    }
}