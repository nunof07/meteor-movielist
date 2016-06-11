Meteor.publishComposite('listsmovies.movies', publishListMovies);
Meteor.publishComposite('listsmovies.movies.paging', publishListMoviesPaging);
Meteor.publishComposite('listsmovies.lists', publishMovieLists);

function publishListMoviesPaging({
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
    limit
}) {
    const movieScoreFilter = {
        min: movieScoreMin,
        max: movieScoreMax
    };
    const userScoreFilter = {
        min: userScoreMin,
        max: userScoreMax
    };
    const runtimeFilter = {
        min: runtimeMin,
        max: runtimeMax
    };
    validate();
    this.autorun(autorun);
    return;
    
    function validate() {
        new SimpleSchema({
            listId: { type: String, regEx: SimpleSchema.RegEx.Id },
            title: { type: String },
            genres: { type: [String] },
            runtimeMin: { type: Number, min: 0 },
            runtimeMax: { type: Number, min: 0, optional: true },
            userScoreMin: { type: Number, min: 0, max: 5 },
            userScoreMax: { type: Number, min: 0, max: 5 },
            movieScoreMin: { type: Number, min: 0, max: 5 },
            movieScoreMax: { type: Number, min: 0, max: 5 },
            skip: { type: Number, min: 0 },
            limit: { type: Number, min: 1, max: 20 }
        }).validate({
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
            limit
        });
    }
    function autorun(computation) {
        if (this.userId) {
            const list = Lists.findOne(listId);

            if (list && list.isEditableBy(this.userId)) {
                const ids = getMovieIds(listId, this.userId, userScoreFilter, movieScoreFilter);
                const selector = getMoviesSelector(ids, title, genres, runtimeFilter);
                const movies = Movies.find(selector, {
                    skip: skip,
                    limit: limit,
                    fields: Movies.publicFields
                });
                const result = movies.fetch();
                const filteredIds = _.pluck(result, '_id');

                return [
                    movies,
                    MovieScores.find({
                        movieId: { $in: filteredIds }
                    }, { fields: MovieScores.publicFields }),
                    Scores.find({
                        userId: this.userId,
                        movieId: { $in: filteredIds }
                    }, { fields: Scores.publicFields }),
                ];
            }
        }

        return this.ready();

        function getMoviesSelector(ids, title, genres, runtimeFilter) {
            const selector = {
                _id: { $in: ids },
                runtime: { $gte: runtimeFilter.min }
            };

            if (title) {
                selector.title = new RegExp('.*' + title + '.*', 'i');
            }

            if (genres && genres.length) {
                selector.genres = { $all: genres };
            }

            if (runtimeFilter.max) {
                selector.runtime.$lte = runtimeFilter.max;
            }

            return selector;
        }
        function getMovieIds(listId, userId, userScoreFilter, movieScoreFilter) {
            const listsMoviesIds = getListsMovieIds(listId);
            const scores = getScores(userId, listsMoviesIds);
            const movieScores = getMovieScores(listsMoviesIds);

            const result = [];
            _.forEach(listsMoviesIds, processId);
            return result;

            function getListsMovieIds(listId) {
                const listMovies = ListsMovies.find({
                    listId: listId
                }, { fields: ListsMovies.publicFields })
                .fetch();

                return _.pluck(listMovies, 'movieId');
            }
            function getScores(userId, movieIds) {
                return Scores.find({
                    userId: userId,
                    movieId: { $in: movieIds },
                }, { fields: Scores.publicFields })
                .fetch();
            }
            function getMovieScores(movieIds) {
            return MovieScores.find({
                    movieId: { $in: movieIds },
                }, { fields: MovieScores.publicFields })
                .fetch();
            }
            function processId(id) {
                const score = _.findWhere(scores, { movieId: id });
                const movieScore = _.findWhere(movieScores, { movieId: id });
                
                if (isScoreValid(score) && isMovieScoreValid(movieScore)) {
                    result.push(id);
                }
            }
            function isScoreValid(score) {
                return (!score && userScoreFilter.min === 0) ||
                    (score &&
                    score.score >= userScoreFilter.min && score.score <= userScoreFilter.max);
            }
            function isMovieScoreValid(movieScore) {
                return (!movieScore && movieScoreFilter.min === 0) ||
                    (movieScore &&
                    movieScore.average >= movieScoreFilter.min && movieScore.average <= movieScoreFilter.max);
            }
        }
    }
}
function publishListMovies({ listId }) {
    validate();
    return {
        find: findList,
        children: [{
            find: findListMovies,
            children: [{
                find: findMovie,
                children: [
                    { find: findMovieScores },
                    { find: findUserScore }
                ]
            }]
        }]
    };
    
    function validate() {
         new SimpleSchema({
            listId: ListsMovies.fields.listId
        }).validate({ listId });
    }
    function findList() {
        if (!this.userId) {
            return;
        } else {
            return Lists.find({
                _id: listId
            }, {
                limit: 1,
                fields: Lists.publicFields
            });
        }
    }
    function findListMovies(list) {
        if (!list.isEditableBy(this.userId)) {
            return;
        } else {
            return ListsMovies.find({
                listId: list._id
            }, {
                fields: {
                    listId: 1,
                    movieId: 1
                }
            });
        }
    }
    function findMovie(listMovie) {
        return Movies.find({
            _id: listMovie.movieId
        }, {
            limit: 1,
            fields: Movies.publicFields
        });
    }
    function findMovieScores(movie) {
        return MovieScores.find({ movieId: movie._id }, { fields: MovieScores.publicFields });
    }
    function findUserScore(movie) {
        const selector = {
            userId: this.userId,
            movieId: movie._id
        };
        
        return Scores.find(selector, { fields: Scores.publicFields });
    }
}
function publishMovieLists({ movieId }) {
    validate();
    return {
        find: findMovieLists,
        children: [{
            find: findList,
            collectionName: 'MovieLists'
        }]
    };
    
    function validate() {
         new SimpleSchema({
            movieId: ListsMovies.fields.movieId
        }).validate({ movieId });
    }
    function findMovieLists() {
        if (!this.userId) {
            return;
        } else {
            return ListsMovies.find({
                movieId
            }, {
                fields: {
                    listId: 1,
                    movieId: 1
                }
            });
        }
    }
    function findList(listMovie) {
        const userListsSelector = Lists.getUserListsSelector(this.userId);
        const listSelector = { _id: listMovie.listId };
        
        return Lists.find({
            $and: [
                listSelector,
                userListsSelector
            ]
        }, { fields: Lists.publicFields });
    }
}