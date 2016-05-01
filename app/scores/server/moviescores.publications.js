Meteor.publish('movieScores.movie', publishMovieScoresMovie);

function publishMovieScoresMovie({ movieId }) {
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
            return MovieScores.find({ movieId }, MovieScores.publicFields);
        }
    }
}