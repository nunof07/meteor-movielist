Meteor.startup(i18nMoviesStartup);

function i18nMoviesStartup() {
    i18n.map('en', {
        movies: {
            noResults: 'No results found',
            searchFailed: 'Error searching for movie. {$1}',
            addFailed: 'Error adding movie. {$1}',
            searchLabel: 'Search movie',
            add: 'Add movie',
            addSuccess: 'Movie added'
        }
    });
}