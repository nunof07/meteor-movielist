Meteor.startup(i18nListsStartup);

function i18nListsStartup() {
    i18n.map('en', {
        lists: {
            form: {
                add: 'Create new list',
                name: 'Name',
                isPublic: 'Allow anyone to view or edit',
                errors: {
                    saveFailed: 'An error occured while saving the list. Please try again.'
                }
            },
            delete: {
                title: 'Delete {$1}',
                message: 'Are you sure you want to delete this list?',
                deleteFailed: 'An error occured while deleting the list. Please try again.'
            },
            labels: {
                isPublic: 'Public'
            },
            actions: {
                new: 'New list'
            }
        }
    });
}