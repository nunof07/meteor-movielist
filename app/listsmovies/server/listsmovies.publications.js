Meteor.publishComposite('listsmovies.movies', publishListMovies);
Meteor.publishComposite('listsmovies.lists', publishMovieLists);

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
        return MovieScores.find({ movieId: movie._id }, MovieScores.publicFields);
    }
    function findUserScore(movie) {
        const selector = {
            userId: this.userId,
            movieId: movie._id
        };
        
        return Scores.find(selector, Scores.publicFields);
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
        }, Lists.publicFields);
    }
}