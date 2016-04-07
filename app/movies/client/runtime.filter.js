angular
    .module('movielist')
    .filter('mlRuntime', runtimeFilter);

function runtimeFilter() {
    return filter;
    
    function filter(runtime) {
        if (runtime && angular.isNumber(runtime)) {
            const hours = Math.floor(runtime / 60);          
            const minutes = runtime % 60;
            
            return hours + 'h ' + minutes + 'min';
        }
        
        return runtime;
    }
}