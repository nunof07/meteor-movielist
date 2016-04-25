Meteor.publish('movieScore.all', publishMovieScore);

function publishMovieScore({ movieId }) {
    validate();
    this.autorun(autorun);
    return;
    
    function validate() {
         new SimpleSchema({
            movieId: ML.fields.id
        }).validate({ movieId });
    }
    function autorun(compution) {
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