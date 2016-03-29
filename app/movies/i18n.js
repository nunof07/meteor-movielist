Meteor.startup(i18nMoviesStartup);

function i18nMoviesStartup() {
    i18n.map('en', {
        movies: {
            noResults: 'No results found'
        }
    });
}