Meteor.publish('movieDetails.user', publishUserMovieDetails);

function publishUserMovieDetails({ movieId }) {
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
            return Movies.find({ _id: movieId }, { fields: Movies.publicFields });
        }
    }
}