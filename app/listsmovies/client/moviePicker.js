angular
    .module('movielist')
    .factory('MoviePicker', MoviePicker);

function MoviePicker($q) {
    return MoviePickerClass;
    
    function MoviePickerClass(movies, getUserScore, getMovieScore) {
        // methods
        this.pick = pick;
        this.getUserScore = getUserScore;
        this.getMovieScore = getMovieScore;
        
        // variables
        this.movies = movies;
        this.lastPick = {};
        this.index = 0;
    }
    
    function pick() {
        const deferred = $q.defer();
        
        if (this.movies && this.movies.length) {
            const movie = this.movies[this.index];
            this.lastPick = {
                movie,
                userScore: this.getUserScore(movie),
                movieScore: this.getMovieScore(movie)
            };
            this.index += 1;
            
            if (this.index >= this.movies.length) {
                this.index = 0;
            }
            
            deferred.resolve(this.lastPick);
        } else {
            deferred.reject('noMovieFound');
        }
        
        return deferred.promise;
    }
}