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
    
    // find existing vote
    const existing = Scores.findOne({
        userId: this.userId,
        movieId
    });
    
    if (existing) {
        // update existing vote
        Scores.update(existing._id, { $set: {
            score,
            modifiedAt: new Date()
        } });
        
        return existing._id;
    } else {
        // not voted yet, create new one
        return Scores.insert({
            userId: this.userId,
            movieId,
            score,
            createdAt: new Date(),
            modifiedAt: new Date()
        });
    }
}