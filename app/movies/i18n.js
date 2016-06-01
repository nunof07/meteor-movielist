Meteor.startup(i18nMoviesStartup);

function i18nMoviesStartup() {
    i18n.map('en', {
        movies: {
            noResults: '<i class="icon i-info"></i>No results found',
            searchFailed: 'Error searching for movie. {$1}',
            addFailed: 'Error adding movie. {$1}',
            searchLabel: 'Add new movie...',
            add: 'Add movie',
            addSuccess: '<i class="icon i-success"></i>Movie added'
        }
    });
}