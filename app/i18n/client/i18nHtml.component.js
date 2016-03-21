angular
    .module('movielist')
    .directive('mlI18nHtml', i18nHtmlDirective);

function i18nHtmlDirective(i18nService) {
    return {
        restrict: 'A',
        scope: {
            mlI18nHtml: '@',
            mlI18nParams: '='
        },
        compile: i18nHtmlDirectiveCompile
    };
    
    function i18nHtmlDirectiveCompile(element, attrs) {
        return compile;
        
        function compile(scope, element, attr) {
            scope.$watch('mlI18nHtml', update);
            scope.$watch('mlI18nParams', update);
            
            function update() {
                const content = i18nService.get(scope.mlI18nHtml, scope.mlI18nParams);
                element.html(content);
            }
        }
    }
}