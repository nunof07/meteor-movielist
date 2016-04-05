Meteor.publishComposite('listsmovies.movies', publishListsMovies);

function publishListsMovies({ listId }) {
    validate();
    return {
        find: findList,
        children: [{
            find: findListMovies,
            children: [{ find: findMovie }]
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
    // function autorun(compution) {
    //     if (!this.userId) {
    //         return this.ready();
    //     } else {
    //         const userListsSelector = getUserListsSelector(this.userId);
    //         const listSelector = { _id: listId };
            
    //         return Lists.find({
    //             $and: [
    //                 listSelector,
    //                 userListsSelector
    //             ]
    //         }, Lists.publicFields);
    //     }
    // }
}

// Meteor.publishComposite('topTenPosts', {
//     find: function() {
//         // Find top ten highest scoring posts
//         return Posts.find({}, { sort: { score: -1 }, limit: 10 });
//     },
//     children: [
//         {
//             find: function(post) {
//                 // Find post author. Even though we only want to return
//                 // one record here, we use "find" instead of "findOne"
//                 // since this function should return a cursor.
//                 return Meteor.users.find(
//                     { _id: post.authorId },
//                     { limit: 1, fields: { profile: 1 } });
//             }
//         },
//         {
//             find: function(post) {
//                 // Find top two comments on post
//                 return Comments.find(
//                     { postId: post._id },
//                     { sort: { score: -1 }, limit: 2 });
//             },
//             children: [
//                 {
//                     find: function(comment, post) {
//                         // Find user that authored comment.
//                         return Meteor.users.find(
//                             { _id: comment.authorId },
//                             { limit: 1, fields: { profile: 1 } });
//                     }
//                 }
//             ]
//         }
//     ]
// });