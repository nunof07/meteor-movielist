Meteor.startup(i18nHomeStartup);

function i18nHomeStartup() {
    i18n.map('en', {
        about: {
            title: 'About',
            description: '<p>MovieList is an open source web app (' +
                '<a href="https://github.com/nunof07/meteor-movielist">' +
                    'view on GitHub</a>) ' +
                'for managing movie lists. ' +
                'It allows multiple users and private/public sharing, but it was built with self-hosting in mind.</p>',
            tmdbTitle: 'The Movie Database',
            tmdb: '<p>The movie data and images come from <a href="https://www.themoviedb.org/">TMDb</a>. ' +
                'A special thank you to all the people who maintain TMDb.</p>' +
                '<p>This product uses the TMDb API but is not endorsed or certified by TMDb.</p>',
            developmentTitle: 'Development',
            development: '<p>This web app was built with ' +
                '<a href="http://www.angular-meteor.com/">angular-meteor</a> (' +
                '<a href="https://angularjs.org/">AngularJS</a> + ' +
                '<a href="https://www.meteor.com/">Meteor</a>), ' +
                '<a href="http://getbootstrap.com/">Bootstrap</a>, ' +
                '<a href="http://fontawesome.io/">FontAwesome</a> ' +
                'and many other community packages.</p>' +
                '<p>The design is based on the ' +
                '<a href="https://bootswatch.com/lumen/">Lumen</a> theme from ' +
                '<a href="https://bootswatch.com/">Bootswatch</a>.</p>' +
                '<p>Thanks to everyone who contributes to these.</p>',
        }
    });
}