angular
    .module('movielist')
    .directive('mlI18n', i18nDirective);

function i18nDirective(i18nService) {
    return {
        restrict: 'A',
        scope: {
            mlI18n: '@',
            mlI18nParams: '='
        },
        compile: i18nDirectiveCompile
    };
    
    function i18nDirectiveCompile(element, attrs) {
        return compile;
        
        function compile(scope, element, attr) {
            element = element[0];
            scope.$watch('mlI18n', update);
            scope.$watch('mlI18nParams', update);
            
            function update() {
                const content = i18nService.get(scope.mlI18n, scope.mlI18nParams);
                element.textContent = content;
            }
        }
    }
}