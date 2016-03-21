Meteor.startup(i18nListsStartup);

function i18nListsStartup() {
    i18n.map('en', {
        lists: {
            form: {
                add: 'Create new list',
                name: 'Name',
                isPublic: 'Share list with other members',
                errors: {
                    saveFailed: 'An error occured while saving the list. Please try again.'
                }
            }
        }
    });
}