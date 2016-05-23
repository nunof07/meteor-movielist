Meteor.startup(i18nStartup);

function i18nStartup() {
    i18n.showMissing('<%= label %>');
    i18n.setDefaultLanguage('en');
    i18n.map('en', {
        siteName: 'MovieList',
        forms: {
            save: 'Save',
            cancel: 'Cancel',
            delete: 'Delete',
            close: 'Close'
        },
        loading: 'Loading...',
        github: 'GitHub',
        tmdbTerms: 'This product uses the TMDb API but is not endorsed or certified by TMDb.'
    });
}