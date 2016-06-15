angular
    .module('movielist')
    .factory('MoviePicker', MoviePicker);

function MoviePicker($q) {
    return MoviePickerClass;
    
    function MoviePickerClass({ movies, userScores, movieScores }) {
        // public methods
        this.pick = pick;
        
        // variables
        this.lastPick = {
            movie: null,
            userScore: null,
            movieScore: null
        };
        this.selectable = getSelectable(movies, userScores, movieScores);
        this.all = angular.copy(this.selectable);
        return;
        
        function getSelectable(movies, userScores, movieScores) {
            const selectable = [];
            angular.forEach(movies, addMovie);
            return selectable;
            
            function addMovie(movie, index) {
                const movieScore = movieScores[movie._id];
                
                if (movieScore) {
                    selectable.push({
                        movie,
                        userScore: userScores[movie._id],
                        movieScore
                    });
                }
            }
        }
    }
    function pick() {
        const picker = this;
        const deferred = $q.defer();
        
        if (!isEmpty()) {
            picker.lastPick = getPick();
            deferred.resolve(picker.lastPick);
        } else {
            deferred.reject('noMovieFound');
        }
        
        return deferred.promise;
        
        function isEmpty() {
            return (!picker.all || !picker.all.length);
        }
        function getPick() {
            if (!picker.selectable || !picker.selectable.length) {
                if (!picker.all) {
                    return null;
                }
                picker.selectable = angular.copy(picker.all);
            }
            const pick = getRandomPick(picker.selectable);
            removePickFromSelectable(pick);
            return pick;
        }
        function removePickFromSelectable(pick) {
            const index = picker.selectable.indexOf(pick);
            picker.selectable.splice(index, 1);
        }
    }
    function getMovieScore(pick) {
        return (pick.movieScore ? pick.movieScore.average : 0);
    }
    function scoreToWeight(score) {
        return Math.floor(score * 10);
    }
    function weightToScore(weight) {
        return weight * 0.1;
    }
    function getPicksWithWeight(picks, weight) {
        const score = weightToScore(weight);
        const min = score;
        const max = score + 0.1;
        const result = [];
        angular.forEach(picks, processPick);
        return result;
        
        function processPick(pick) {
            const movieScore = getMovieScore(pick);
            
            if (movieScore >= min && movieScore < max) {
                result.push(pick);
            }
        }
    }
    function getWeightedDistribution(picks) {
        const weights = getWeights(picks);
        return createDistribution(weights);
        
        function getWeights(picks) {
            const weights = [];
            angular.forEach(picks, processWeight);
            return weights;
            
            function processWeight(pick) {
                const score = getMovieScore(pick);
                const weight = scoreToWeight(score);
                const isAdded = (weights.indexOf(weight) !== -1);
                
                if (!isAdded) {
                    weights.push(weight);
                }
            }
        }
        function createDistribution(weights) {
            const distribution = [];
            weights.sort();
            angular.forEach(weights, addWeight);
            return distribution;
            
            function addWeight(weight) {
                for (let i = 0; i < weight; i++) {
                    distribution.push(weight);
                }
            }
        }
    }
    // Returns a random integer between min (included) and max (excluded)
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    function getRandomPick(selectable) {
        const distribution = getWeightedDistribution(selectable);
        const randomWeight = getRandomWeight(distribution);
        const picks = getPicksWithWeight(selectable, randomWeight);
        const randomIndex = getRandomInt(0, picks.length);
        return picks[randomIndex];
        
        function getRandomWeight(distribution) {
            const randomIndex = getRandomInt(0, distribution.length);
            return distribution[randomIndex];
        }
    }
}