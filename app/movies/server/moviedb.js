Meteor.startup(movieDbStartup);

function movieDbStartup() {
    if (Meteor.settings.private && Meteor.settings.private.tmdb) {
        MovieDb = Meteor.npmRequire('moviedb')(Meteor.settings.private.tmdb);
    } else {
        MovieDb = null;
    }
}