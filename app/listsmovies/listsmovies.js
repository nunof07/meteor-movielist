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
        return ListsMovies.insert({
            listId,
            movieId,
            createdAt: new Date(),
            modifiedAt: new Date(),
        });
    }
}
function listsMoviesDelete({listId, movieId}) {
    if (!Lists.methods.hasAccess.call({ listId })) {
        throw new Meteor.Error('unauthorized', 'User not authorized to update list');
    }
    
    return ListsMovies.remove({
        listId,
        movieId
    });
}