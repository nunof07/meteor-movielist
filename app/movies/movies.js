Movies = ML.createCollection('Movies', {
    title: { type: String },
    originalTitle: { type: String },
    
    tmdbId: { type: String },
    imdbId: { type: String },
    
    released: { type: Date },
    summary: { type: String },
    genres: { type: [String] },
    runtime: { type: Number, min: 0 },
    
    tmdbPosterUrl: { type: String, optional: true },
    trailerYouTubeId: { type: String, optional: true },
    
    createdAt: { type: Date, denyUpdate: true },
    modifiedAt: { type: Date },
}, ['title', 'originalTitle', 'tmdbId', 'imdbId', 'released',
    'summary', 'genres', 'runtime', 'tmdbPosterUrl', 'trailerYouTubeId']);

ML.createMethods(Movies, [
    {
        name: 'searchTmdb',
        fields: [{ query: ML.fields.string }],
        run: moviesSearchTmdb
    },
    {
        name: 'insertOrUpdateFromTmdb',
        fields: [{ tmdbId: { type: Number, min: 1 } }],
        run: moviesInsertOrUpdateFromTmdb
    },
    {
        name: 'isYouTubeTrailerValid',
        fields: [{ movieId: ML.fields.id }],
        run: moviesIsYouTubeTrailerValid
    }
]);

function movieDbQuery(queryCallback, emptyValue) {
    if (this.isSimulation) {
        return;
    } else {
        if (!MovieDb) {
            throw new Meteor.Error('moviedb-error', 'MovieDb not available');
        } else {
            const response = Async.runSync(queryCallback);
            
            if (response.error) {
                throw new Meteor.Error('moviedb-error', response.error);
            } else if (response.result) {
                return response.result;
            } else {
                return;
            }
        }
    }
}
function moviesSearchTmdb({query}) {
    if (!this.userId) {
        throw new Meteor.Error('unauthorized', 'Must be logged in to search a movie');
    }
    const result = movieDbQuery.call(this, runMovieSearch);
    
    if (result && result.results) {
        // only return first 6 results
        return result.results.slice(0, 6);
    }
    return [];
    
    function runMovieSearch(done) {
        return MovieDb.searchMovie({query}, done);
    }
}
function moviesInsertOrUpdateFromTmdb({ tmdbId }) {
    if (!this.userId) {
        throw new Meteor.Error('unauthorized', 'Must be logged in to find movie info');
    }
    tmdbId = tmdbId.toString();
    const tmdbMovie = movieDbQuery.call(this, runMovieInfo);
    
    if (tmdbMovie) {
        return insertOrUpdate(tmdbMovie);
    } else {
        return false;
    }
    
    function runMovieInfo(done) {
        return MovieDb.movieInfo({
            id: tmdbId,
            append_to_response: 'videos'
        }, done);
    }
    function getMovieData(tmdb) {
        const videos = tmdb.videos ? tmdb.videos.results : [];
        const trailer = _.chain(videos)
            .where({
                type: 'Trailer',
                site: 'YouTube'
            })
            .first()
            .value();
        
        return {
            title: tmdb.title,
            originalTitle: tmdb.original_title,
            
            tmdbId: tmdb.id.toString(),
            imdbId: tmdb.imdb_id,
            
            released: new Date(tmdb.release_date),
            summary: tmdb.overview,
            genres: _.pluck(tmdb.genres, 'name'),
            runtime: tmdb.runtime,
            
            tmdbPosterUrl: tmdb.poster_path,
            trailerYouTubeId: trailer ? trailer.key : ''
        };
    }
    function insertOrUpdate(tmdbMovie) {
        const movie = Movies.findOne({tmdbId});
        let data = getMovieData(tmdbMovie);
        
        if (movie) {
            // update
            data = _.extend(data, {
                modifiedAt: new Date()
            });
            const result = Movies.update(movie._id, { $set: data });
            
            if (result) {
                return movie._id;
            }
        } else {
            // insert
            data = _.extend(data, {
                createdAt: new Date(),
                modifiedAt: new Date()
            });
            return Movies.insert(data);
        }
    }
}
function moviesIsYouTubeTrailerValid({ movieId }) {
    if (!this.userId) {
        throw new Meteor.Error('unauthorized', 'Must be logged in to see if a movie has a valid YouTube Trailer');
    }
    const movie = Movies.findOne(movieId);
    
    if (movie && movie.trailerYouTubeId && !this.isSimulation) {
        const url = 'http://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=' +
            movie.trailerYouTubeId + '&format=json';
        this.unblock();
        
        try {
            const response = HTTP.get(url);
            return true;
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range
            return false;
        }
    } else {
        return false;
    }
}