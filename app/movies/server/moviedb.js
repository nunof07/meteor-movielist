if (Meteor.settings.private && Meteor.settings.private.tmdb) {
    MovieDb = Meteor.npmRequire('moviedb')(Meteor.settings.private.tmdb);
}