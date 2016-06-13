angular
    .module('movielist')
    .filter('mlScoreFilter', mlScoreFilter);

function mlScoreFilter(numberFilter) {
    return filter;
    
    function filter(score) {
        if (score === parseInt(score)) {
            return score;
        }

        return numberFilter(score, 1);
    }
}