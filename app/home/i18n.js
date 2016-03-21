Meteor.startup(i18nHomeStartup);

function i18nHomeStartup() {
    i18n.map('en', {
        home: {
            title: 'Home',
            hello: 'Hello World!'
        }
    });
}