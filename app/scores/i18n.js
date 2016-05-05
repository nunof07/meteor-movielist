Meteor.startup(i18nScoresStartup);

function i18nScoresStartup() {
    i18n.map('en', {
        scores: {
            saveFailed: 'Failed to save vote. {$1}',
            star10: '1 star',
            star15: '1 1/2 stars',
            star20: '2 stars',
            star25: '2 1/2 stars',
            star30: '3 stars',
            star35: '3 1/2 stars',
            star40: '4 stars',
            star45: '4 1/2 stars',
            star50: '5 stars',
            vote: 'Vote',
            label: 'Scores'
        }
    });
}