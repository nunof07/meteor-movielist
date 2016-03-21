Meteor.startup(i18nHomeStartup);

function i18nHomeStartup() {
    i18n.map('en_US', {
        home: {
            title: 'Home',
            hello: 'Hello World!'
        }
    });
}