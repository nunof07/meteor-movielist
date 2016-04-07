angular
    .module('movielist')
    .filter('mlGenres', genresFilter);

function genresFilter() {
    return filter;
    
    function filter(genres) {
        if (genres && angular.isArray(genres)) {
            return genres.join(', ');
        }
        
        return genres;
    }
}