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