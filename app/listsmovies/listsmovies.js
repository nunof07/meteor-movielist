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
    }
]);

function listsMoviesInsert({listId, movieId}) {
    if (!Lists.methods.hasAccess.call({ listId })) {
        throw new Meteor.Error('unauthorized', 'User not authorized to update list');
    }
    
    return ListsMovies.insert({
        listId,
        movieId,
        createdAt: new Date(),
        modifiedAt: new Date(),
    });
}