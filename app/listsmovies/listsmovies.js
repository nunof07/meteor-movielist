ListsMovies = ML.createCollection('ListsMovies', {
    listId: { type: String, regEx: SimpleSchema.RegEx.Id, denyUpdate: true },
    movieId: { type: String, regEx: SimpleSchema.RegEx.Id, denyUpdate: true },
    createdAt: { type: Date, denyUpdate: true },
    modifiedAt: { type: Date },
}, ['listId', 'movieId']);

ML.createMethods(ListsMovies, [
    {
        name: 'insert',
        fields: ['listId', 'movieId'],
        run: listsMoviesInsert
    }, {
        name: 'delete',
        fields: ['listId', 'movieId'],
        run: listsMoviesDelete
    }, {
        name: 'fetch',
        fields: [
            'listId',
            { title: { type: String } },
            { genres: { type: [String] } },
            { runtimeMin: { type: Number, min: 0 } },
            { runtimeMax: { type: Number, min: 0, optional: true } },
            { userScoreMin: { type: Number, min: 0, max: 5 } },
            { userScoreMax: { type: Number, min: 0, max: 5 } },
            { movieScoreMin: { type: Number, min: 0, max: 5 } },
            { movieScoreMax: { type: Number, min: 0, max: 5 } },
            { skip: { type: Number, min: 0 } },
            { limit: { type: Number, min: 1, max: 20 } },
            { sortExpression: { type: String } },
            { sortIsReverse: { type: Boolean } },
        ],
        run: listsMoviesFetch
    }
]);

ML.createDenormalizers(ListsMovies, [
    {
        name: 'afterListsMoviesCountChange',
        fields: ['listId'],
        run: afterListsMoviesCountChange
    }
]);

function listsMoviesInsert({listId, movieId}) {
    if (!Lists.methods.hasAccess.call({ listId })) {
        throw new Meteor.Error('unauthorized', 'User not authorized to update list');
    }
    
    // check if we already have movie in list
    const listMovie = ListsMovies.findOne({
        listId,
        movieId
    }, {
        fields: { _id: 1 }
    });
    
    if (listMovie) {
        return listMovie._id;
    } else {
        const result = ListsMovies.insert({
            listId,
            movieId,
            createdAt: new Date(),
            modifiedAt: new Date(),
        });
        
        if (result) {
            ListsMovies.denormalizers.afterListsMoviesCountChange({ listId });
        }
        
        return result;
    }
}
function listsMoviesDelete({listId, movieId}) {
    if (!Lists.methods.hasAccess.call({ listId })) {
        throw new Meteor.Error('unauthorized', 'User not authorized to update list');
    }
    
    const result = ListsMovies.remove({
        listId,
        movieId
    });
    
    if (result) {
        ListsMovies.denormalizers.afterListsMoviesCountChange({ listId });
    }
    
    return result;
}
function listsMoviesFetch({
    listId,
    title,
    genres,
    runtimeMin,
    runtimeMax,
    userScoreMin,
    userScoreMax,
    movieScoreMin,
    movieScoreMax,
    skip,
    limit,
    sortExpression,
    sortIsReverse
}) {
    if (!Lists.methods.hasAccess.call({ listId })) {
        throw new Meteor.Error('unauthorized', 'User not authorized to view list');
    }
    const filter = {
        title,
        genres,
        runtime: { min: runtimeMin, max: runtimeMax },
        userScore: { min: userScoreMin, max: userScoreMax },
        movieScore: { min: movieScoreMin, max: movieScoreMax },
        skip,
        limit
    };
    const sort = {
        expression: sortExpression,
        isReverse: sortIsReverse
    };
    const allMovies = getMoviesFromList(listId);
    const range = getRange(allMovies);
    const filtered = getFiltered(allMovies, filter, sort, this.userId);

    return {
        filtered,
        range
    };

    function getMoviesFromList(listId) {
        const listsMoviesIds = getListsMovieIds(listId);

        return Movies.find(
            { _id: { $in: listsMoviesIds } },
            { fields: Movies.publicFields })
        .fetch();

        function getListsMovieIds(listId) {
            const listMovies = ListsMovies.find(
                { listId: listId },
                { fields: ListsMovies.publicFields })
            .fetch();

            return _.pluck(listMovies, 'movieId');
        }
    }
    function getRange(movies) {
        return {
            genres: getGenres(movies),
            runtime: getRuntimeRange(movies),
            count: movies ? movies.length : 0
        };

        function getGenres(movies) {
            let genres = [];

            if (!_.isEmpty(movies)) {
                genres = _.chain(movies)
                    .pluck('genres')
                    .flatten()
                    .sort()
                    .uniq(true)
                    .value();
            }

            return genres;
        }
        function getRuntimeRange(movies) {
            const runtime = { floor: 0 };

            if (!_.isEmpty(movies)) {
                runtime.floor = _.min(movies, (movie) => movie.runtime).runtime;
                runtime.ceil = _.max(movies, (movie) => movie.runtime).runtime;
            }

            return runtime;
        }
    }
    function getFiltered(allMovies, filter, sort, userId) {
        let movies = [];
        let userScores = [];
        let movieScores = [];

        if (allMovies && allMovies.length) {
            movies = filterMovies(allMovies, filter);
            const ids = _.pluck(movies, '_id');
            userScores = getUserScores(userId, ids);
            movieScores = getMovieScores(ids);

            movies = filterMoviesWithScores(movies, userScores, movieScores, filter);
            movies = sortMovies(movies, userScores, movieScores, sort);
            movies = filterMoviesWithPaging(movies, filter);
            
            userScores = filterScores(userScores, movies);
            movieScores = filterScores(movieScores, movies);
        }

        return {
            movies,
            userScores,
            movieScores
        };

        function filterMovies(allMovies, filter) {
            const count = {
                runtime: 0,
                title: 0,
                genres: 0,
                total: 0
            };
            const result = _.filter(allMovies, isMovieFiltered);
            return result;

            function isMovieFiltered(movie) {
                if (runtimeOutsideRange(movie, filter.runtime)) {
                    count.runtime++;
                    return false;
                }

                if (titleNotContains(movie, filter.title)) {
                    count.title++;
                    return false;
                }

                if (missingGenres(movie, filter.genres)) {
                    count.genres++;
                    return false;
                }
                count.total++;
                return true;
            }
            function runtimeOutsideRange(movie, runtime) {
                if (movie.runtime < runtime.min) {
                    return true;
                }

                if (runtime.max) {
                    if (movie.runtime > runtime.max) {
                        return true;
                    }
                }

                return false;
            }
            function titleNotContains(movie, title) {
                if (title && title.trim()) {
                    const filterTitle = title.trim().toLowerCase();
                    const movieTitle = movie.title.toLowerCase();
                    const titleContains = movieTitle.indexOf(filterTitle) > -1;

                    if (!titleContains) {
                        const originalTitle = movie.originalTitle.toLowerCase();
                        const originalTitleContains = originalTitle.indexOf(filterTitle) > -1;

                        if (!originalTitleContains) {
                            return true;
                        }
                    }
                }

                return false;
            }
            function missingGenres(movie, genres) {
                if (genres && genres.length) {
                    const containsAllGenres = _.every(genres, (genre) => _.contains(movie.genres, genre));

                    if (!containsAllGenres) {
                        return true;
                    }
                }

                return false;
            }
        }
        function getUserScores(userId, movieIds) {
            return Scores.find({
                userId: userId,
                movieId: { $in: movieIds }
            }, { fields: Scores.publicFields })
            .fetch();
        }
        function getMovieScores(movieIds) {
            return MovieScores.find({
                movieId: { $in: movieIds }
            }, { fields: MovieScores.publicFields })
            .fetch();
        }
        function filterMoviesWithScores(movies, userScores, movieScores, filter) {
            return _.filter(movies, isMovieScoreValid);

            function isMovieScoreValid(movie) {
                const userScore = _.findWhere(userScores, { movieId: movie._id });

                if (isScoreValid(userScore, 'score', filter.userScore)) {
                    const movieScore = _.findWhere(movieScores, { movieId: movie._id });

                    if (isScoreValid(movieScore, 'average', filter.movieScore)) {
                        return true;
                    }
                }

                return false;
            }
            function isScoreValid(score, property, filter) {
                return (!score && filter.min === 0) ||
                    (score &&
                    score[property] >= filter.min && score[property] <= filter.max);
            }
        }
        function filterMoviesWithPaging(movies, filter) {
            return _.chain(movies)
                .rest(filter.skip)
                .first(filter.limit)
                .value();
        }
        function filterScores(scores, movies) {
            const result = {};

            _.forEach(movies, (movie) => {
                const score = _.find(scores, (score) => score.movieId === movie._id);

                if (score) {
                    result[score.movieId] = score;
                }
            });

            return result;
        }
        function sortMovies(movies, userScores, movieScores, sort) {
            let sorted = [];
            const directSorting = ['title', 'runtime', 'genres'];

            if (_.contains(directSorting, sort.expression)) {
                sorted = _.sortBy(movies, sort.expression);
            } else if (sort.expression === 'userScore') {
                const scores = _.groupBy(userScores, 'movieId');
                sorted = _.sortBy(movies, (movie) => scores[movie._id] ? scores[movie._id][0].score : 0);
            } else if (sort.expression === 'movieScore') {
                const scores = _.groupBy(movieScores, 'movieId');
                sorted = _.sortBy(movies, (movie) => scores[movie._id] ? scores[movie._id][0].average : 0);
            } else {
                sorted = movies;
            }

            if (sort.isReverse) {
                sorted = sorted.reverse();
            }

            return sorted;
        }
    }
}
function afterListsMoviesCountChange({ listId }) {
    if (!Lists.methods.hasAccess.call({ listId })) {
        throw new Meteor.Error('unauthorized', 'User not authorized to update list');
    }
    const listsMovies = ListsMovies.find({ listId }).fetch();
    const movieCount = listsMovies.length;
    
    return Lists.update(listId, { $set: {
        movieCount
    }});
}