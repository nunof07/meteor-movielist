Meteor.startup(i18nStartup);

function i18nStartup() {
    i18n.showMissing('<%= label %>');
    i18n.setDefaultLanguage('en');
    i18n.map('en', {
        title: 'MovieList'
    });
}