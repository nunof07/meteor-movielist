Movies = ML.createCollection('Movies', {
    title: { type: String },
    originalTitle: { type: String },
    
    tmdbId: { type: String },
    imdbId: { type: String },
    
    released: { type: Date },
    summary: { type: String },
    genres: { type: [String] },
    runtime: { type: Number, min: 0 },
    
    posterUrl: { type: String, regEx: SimpleSchema.RegEx.Url, optional: true },
    trailerYouTubeId: { type: String, optional: true },
    
    createdAt: { type: Date, denyUpdate: true },
    modifiedAt: { type: Date },
}, ['title', 'originalTitle', 'tmdbId', 'imdbId', 'released',
    'summary', 'genres', 'runtime', 'posterUrl', 'trailerYouTubeId']);

ML.createMethods(Movies, [
    {
        name: 'searchTmdb',
        fields: [{ query: ML.fields.string }],
        run: moviesSearchTmdb
    }
]);

function moviesSearchTmdb({query}) {
    if (!this.userId) {
        throw new Meteor.Error('unauthorized', 'Must be logged in to search a movie');
    }
    
    return [{
        'id': 550,
        'title': 'Fight Club',
        'original_title': 'Fight Club',
        'release_date': '1999-10-14',
        'overview': 'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground \"fight clubs\" forming in every town, until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion.'
    }, {
        'id': 289732,
        'title': 'Zombie Fight Club',
        'original_title': 'Zombie Fight Club',
        'release_date': '2014-10-23',
        'overview': 'It\'s the end of the century at a corner of the city in a building riddled with crime - Everyone in the building has turned into zombies. After Jenny\'s boyfriend is killed in a zombie attack, she faces the challenge of surviving in the face of adversity. In order to stay alive, she struggles with Andy to flee danger.'
    }];
}