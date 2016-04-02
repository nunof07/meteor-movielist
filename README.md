# meteor-movielist
Meteor app to manage movie lists.


## Configuration

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
    - `tmdb`: API key for [TMDb](https://www.themoviedb.org/) (service to fetch movie data).

You can load these settings in your local development environment by starting Meteor with `meteor --settings settings.json`.