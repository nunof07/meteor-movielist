Meteor.publish('movieScore.all', publishMovieScore);
Meteor.publish('movieScore.user', publishUserMovieScore);
Meteor.publish('movieScores.user', publishUserMovieScores);

function publishMovieScore({ movieId }) {
    validate();
    this.autorun(autorun);
    return;
    
    function validate() {
         new SimpleSchema({
            movieId: ML.fields.id
        }).validate({ movieId });
    }
    function autorun(computation) {
        if (!this.userId) {
            return this.ready();
        } else {
            const selector = { movieId };
            
            // count votes
            Counts.publish(this, 'MovieScore.count',
                Scores.find(selector));
            
            // total score
            Counts.publish(this, 'MovieScore.total',
                Scores.find(selector, { fields: { score: 1 } }),
                { countFromField: 'score' });
                
            return Scores.find(selector, Scores.publicFields);
        }
    }
}
function publishUserMovieScore({ movieId }) {
    validate();
    this.autorun(autorun);
    return;
    
    function validate() {
         new SimpleSchema({
            movieId: ML.fields.id
        }).validate({ movieId });
    }
    function autorun(computation) {
        if (!this.userId) {
            return this.ready();
        } else {
            const selector = {
                userId: this.userId,
                movieId
            };
                
            return Scores.find(selector, Scores.publicFields);
        }
    }
}
function publishUserMovieScores() {
    this.autorun(autorun);
    return;
    
    function autorun(computation) {
        if (!this.userId) {
            return this.ready();
        } else {
            const selector = { userId: this.userId };
                
            return Scores.find(selector, Scores.publicFields);
        }
    }
}