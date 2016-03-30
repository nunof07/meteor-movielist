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
        
        return response.result.results;
    }
    
    function runMovieSearch(done) {
        return MovieDb.searchMovie({query}, onSearchResults);
        
        function onSearchResults(error, results) {
            if (error) {
                throw new Meteor.Error('moviedb-error', error);
            } else {
                done(null, results);
            }
        }
    }
}