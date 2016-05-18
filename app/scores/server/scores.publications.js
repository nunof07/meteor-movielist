Meteor.publishComposite('movieScore.all', publishMovieScore);
Meteor.publish('movieScore.user', publishUserMovieScore);
Meteor.publish('movieScores.user', publishUserMovieScores);

function publishMovieScore({ movieId }) {
    validate();
    return {
        find: findScores,
        children: [{
            find: findUsers
        }]
    };
    
    function validate() {
         new SimpleSchema({
            movieId: ML.fields.id
        }).validate({ movieId });
    }
    function findScores() {
        if (!this.userId) {
            return;
        } else {
            Counts.publish(this, 'movieScore.all.count', Scores.find({ movieId }));
            
            return Scores.find({ movieId }, Scores.publicFields);
        }
    }
    function findUsers(score) {
        return Meteor.users.find({
            _id: score.userId
        }, {
            limit: 1,
            fields: {
                gravatarHash: 1
            }
        });
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