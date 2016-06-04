# meteor-movielist

An open source web app for managing movie lists built with self-hosting in mind. Movie information is fetched from [TMDb][tmdb].

_This product uses the TMDb API but is not endorsed or certified by TMDb._

![MovieList][preview-gif]

## Features

- Create private or public lists. _Public lists are only viewable to registered users._
- Add movies from TMDb.
- Switch between list and grid view.
- Sort and filter movies on different criteria.
- Vote and see user votes. _Users votes are public. You can see on the movie page the user scores._
- Get suggestions for what to watch. _Based on average score and picked from the filtered lists._

## Built with

- [angular-meteor][angular-meteor] ([AngularJS][angular] + [Meteor][meteor]).
- [Bootstrap][bootstrap] and [UI Bootstrap][ui-bootstrap].
- [FontAwesome][fontawesome].
- [Lumen][lumen] theme from [Bootswatch][Bootswatch].

...and many other community packages. Thanks to everyone who contributes to these.

## Deployment

### Configuration

Create a `settings.json` file in the root with the following content:

```
{
    "public": {
        "forbidClientAccountCreation": "true"
    },
    "private": {
        "tmdb": "... TMDb key here ..."
    }
}
```

- `public`:
    - `forbidClientAccountCreation`: set to `true` to disable registration of new accounts. 
- `private`:
    - `tmdb`: API key for [TMDb][tmdb] (service to fetch movie data).

You can load these settings in your local development environment by starting Meteor with `$ meteor --settings settings.json`.

### Deploy locally

- [Install Meteor][meteor-install].
- Clone or download the source code: `$ git clone https://github.com/nunof07/meteor-movielist.git`.
- Change to the project directory.
- Create your `settings.json` file (see above).
- Start the app with `$ meteor --settings settings.json`.
- Open the app in the browser (usually at http://localhost:3000/).

### Deploy with meteor-up

For remote deployments I recommend [meteor-up][mup]. The steps are basically the same, except you have to configure [meteor-up][mup] and run the `deploy` command.

### Deploy to Dokku

To deploy to [Dokku][dokku]:

- Clone or download the source code: `$ git clone https://github.com/nunof07/meteor-movielist.git`.
- Change to the project directory.
- Create your `settings.json` file (see above).
- Add git remote: `$ git remote add dokku dokku@your-host.com:your-app.com`.
- Push to Dokku: `$ git push dokku master`. **You should see an error at this point.**
- In your server where you have Dokku installed:
    - Set the app's URL: `$ dokku config:set your-app.com ROOT_URL=http://your-app.com`.
    - Update the settings:
        - Make sure `settings.json` doesn't contain any spaces/whitespace.
        - Copy `settings.json` to your server.
        - Update the settings: `$ dokku config:set your-app.com METEOR_SETTINGS=$(cat /path/to/settings.json)`.
    - Install MongoDB:
        - `$ dokku plugin:install https://github.com/dokku/dokku-mongo.git mongo`.
        - `$ dokku mongo:create your-app`.
        - `$ dokku mongo:link your-app your-app.com`.
- Now push again from your machine: `$ git push dokku master`. The app should be deployed now.

[tmdb]: https://www.themoviedb.org/
[angular-meteor]: http://www.angular-meteor.com/
[angular]: https://angularjs.org/
[meteor]: https://www.meteor.com/
[bootstrap]: http://getbootstrap.com/
[ui-bootstrap]: http://angular-ui.github.io/bootstrap/
[fontawesome]: http://fontawesome.io/
[lumen]: https://bootswatch.com/lumen/
[bootswatch]: https://bootswatch.com/
[meteor-install]: https://www.meteor.com/install
[preview-gif]: https://cdn.rawgit.com/nunof07/meteor-movielist/4fba0462f0c49acd5e4b76b4a6d8425941d2f8b6/public/images/movielist_demo.gif
[mup]: https://github.com/arunoda/meteor-up
[dokku]: http://dokku.viewdocs.io/dokku/