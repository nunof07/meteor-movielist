Scores = ML.createCollection('Scores', {
    userId: { type: String, regEx: SimpleSchema.RegEx.Id, denyUpdate: true },
    movieId: { type: String, regEx: SimpleSchema.RegEx.Id, denyUpdate: true },
    score: { type: Number, min: 1, max: 5 },
    createdAt: { type: Date, denyUpdate: true },
    modifiedAt: { type: Date },
}, ['userId', 'movieId', 'score']);

ML.createMethods(Scores, [
    {
        name: 'vote',
        fields: ['movieId', 'score'],
        run: scoresVote
    }
]);

ML.createDenormalizers(Scores, [
    {
        name: 'afterMovieScoresChange',
        fields: ['movieId'],
        run: afterMovieScoresChange
    }
]);

function scoresVote({movieId, score}) {
    // user check
    if (!this.userId) {
        throw new Meteor.Error('unauthorized', 'Must be logged in to vote');
    }
    
    // movie check
    const movie = Movies.findOne(movieId, { fields: { _id: 1 } });
    
    if (!movie) {
        throw new Meteor.Error('not-found', 'Movie not found');
    }
    
    // insert or update
    const findSelector = {
        userId: this.userId,
        movieId
    };
    const insertData = {
        userId: this.userId,
        movieId,
        score,
        createdAt: new Date(),
        modifiedAt: new Date()
    };
    const updateData = {
        score,
        modifiedAt: new Date()
    };
    const returnId = Scores.insertOrUpdate(findSelector, insertData, updateData);
    Scores.denormalizers.afterMovieScoresChange({ movieId });
    
    return returnId;
}
function afterMovieScoresChange({ movieId }) {
    const scores = Scores.find({ movieId }).fetch();
    const count = scores.length;
    const total = _.reduce(scores, addScore, 0);
    const average = (count > 0 ? total / count : undefined);
    const insertData = {
        movieId,
        count,
        total,
        average,
        createdAt: new Date(),
        modifiedAt: new Date()
    };
    const updateData = {
        count,
        total,
        average,
        modifiedAt: new Date()
    };
    return MovieScores.insertOrUpdate({ movieId }, insertData, updateData);
    
    function addScore(memo, score) {
        return memo + score.score;
    }
}