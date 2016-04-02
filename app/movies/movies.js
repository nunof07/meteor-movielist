Movies = ML.createCollection('Movies', {
    title: { type: String },
    originalTitle: { type: String },
    
    tmdbId: { type: String },
    imdbId: { type: String },
    
    released: { type: Date },
    summary: { type: String },
    genres: { type: [String] },
    runtime: { type: Number, min: 0 },
    
    posterUrl: { type: String, regEx: SimpleSchema.RegEx.Url, optional: true },
    trailerYouTubeId: { type: String, optional: true },
    
    createdAt: { type: Date, denyUpdate: true },
    modifiedAt: { type: Date },
}, ['title', 'originalTitle', 'tmdbId', 'imdbId', 'released',
    'summary', 'genres', 'runtime', 'posterUrl', 'trailerYouTubeId']);

ML.createMethods(Movies, [
    {
        name: 'searchTmdb',
        fields: [{ query: ML.fields.string }],
        run: moviesSearchTmdb
    }
]);

function moviesSearchTmdb({query}) {
    if (!this.userId) {
        throw new Meteor.Error('unauthorized', 'Must be logged in to search a movie');
    }
    
    if (this.isSimulation) {
        return [];
    } else {
        const response = Async.runSync(runMovieSearch);
        
        if (response.error) {
            throw new Meteor.Error('moviedb-error', response.error);
        } else if (response.result) {
            // only return first 6 results
            return response.result.results.slice(0, 6);
        } else {
            return [];
        }
    }
    
    function runMovieSearch(done) {
        if (MovieDb) {
            return MovieDb.searchMovie({query}, onSearchResults);
        } else {
            done('MovieDb not available', null);
            return;
        }
        
        function onSearchResults(error, results) {
            done(error, results);
        }
    }
}