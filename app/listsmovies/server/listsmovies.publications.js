Meteor.publishComposite('listsmovies.lists', publishMovieLists);

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