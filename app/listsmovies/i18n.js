Meteor.startup(i18nListsMoviesStartup);

function i18nListsMoviesStartup() {
    i18n.map('en', {
        listsMovies: {
            deleteMovieFailed: 'Unable to remove the movie from the list. {$1}',
            lists: 'Lists',
            addToList: 'Add movie to list',
            removeFromList: 'Remove from list',
            labels: {
                title: 'Title',
                runtime: 'Runtime',
                genres: 'Genres',
                userScore: 'My score',
                movieScore: 'Movie score'
            }
        }
    });
}