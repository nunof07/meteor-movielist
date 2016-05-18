angular
    .module('movielist')
    .filter('mlYouTubeUrl', youTubeUrlFilter);

function youTubeUrlFilter($sce) {
    return filter;
    
    function filter(trailerYouTubeId, isEmbed) {
        if (!trailerYouTubeId) {
            return '';
        } else {
            const youTubeUrl = getBaseUrl(isEmbed) + trailerYouTubeId;
            return $sce.trustAsResourceUrl(youTubeUrl);
        }
        
        function getBaseUrl(isEmbed) {
            if (isEmbed) {
                return 'https://www.youtube.com/embed/';
            } else {
                return 'https://www.youtube.com/watch?v=';
            }
        }
    }
}