Meteor.startup(i18nListsMoviesStartup);

function i18nListsMoviesStartup() {
    i18n.map('en', {
        listsMovies: {
            deleteMovieFailed: 'Unable to remove the movie from the list. {$1}'
        }
    });
}