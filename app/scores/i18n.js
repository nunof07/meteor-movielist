Meteor.startup(i18nScoresStartup);

function i18nScoresStartup() {
    i18n.map('en', {
        scores: {
            saveFailed: 'Failed to save vote. {$1}'
        }
    });
}