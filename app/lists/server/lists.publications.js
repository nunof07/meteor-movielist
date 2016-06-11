Meteor.publish('lists.user', publishUserLists);
Meteor.publish('listDetails.user', publishUserListDetails);

function publishUserLists() {
    this.autorun(autorun);
    return;
    
    function autorun(computation) {
        if (!this.userId) {
            return this.ready();
        } else {
            const selector = Lists.getUserListsSelector(this.userId);
            
            return Lists.find(selector, { fields: Lists.publicFields });
        }
    }
}
function publishUserListDetails({ listId }) {
    validate();
    this.autorun(autorun);
    return;
    
    function validate() {
         new SimpleSchema({
            listId: ML.fields.id
        }).validate({ listId });
    }
    function autorun(computation) {
        if (!this.userId) {
            return this.ready();
        } else {
            const userListsSelector = Lists.getUserListsSelector(this.userId);
            const listSelector = { _id: listId };
            
            return Lists.find({
                $and: [
                    listSelector,
                    userListsSelector
                ]
            }, { fields: Lists.publicFields });
        }
    }
}