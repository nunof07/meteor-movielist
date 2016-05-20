angular
    .module('movielist')
    .directive('mlI18nReplace', i18nReplaceDirective);

function i18nReplaceDirective(i18nService) {
    return {
        restrict: 'E',
        scope: {
            html: '@',
            params: '='
        },
        compile: i18nReplaceDirectiveCompile
    };
    
    function i18nReplaceDirectiveCompile(element, attrs) {
        return compile;
        
        function compile(scope, element, attr) {
            scope.$watch('html', update);
            scope.$watch('params', update);
            
            function update() {
                const content = i18nService.get(scope.html, scope.params);
                element.html(content);
            }
        }
    }
}