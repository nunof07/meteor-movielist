Meteor.startup(i18nStartup);

function i18nStartup() {
    i18n.showMissing('<%= label %>');
    i18n.setDefaultLanguage('en_US');
    i18n.map('en_US', {
        title: 'MovieList'
    });
}