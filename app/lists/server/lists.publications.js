Meteor.publish('lists.user', publishUserLists);
Meteor.publish('listDetails.user', publisUserListDetails);

function getUserListsSelector(userId) {
    const publicListSelector = { isPublic: true };
    const isOwnerSelector = {
        $and: [
            { ownerId: userId },
            { ownerId: { $exists: true } }
        ]
    };
    const notDeletedSelector = { isDeleted: { $ne: true } };
    const selector = {
        $and: [
            { $or: [
                publicListSelector,
                isOwnerSelector
            ] },
            notDeletedSelector
        ]
    };
    
    return selector;
}
function publishUserLists() {
    this.autorun(autorun);
    return;
    
    function autorun(compution) {
        if (!this.userId) {
            return this.ready();
        } else {
            const selector = getUserListsSelector(this.userId);
            
            return Lists.find(selector, Lists.publicFields);
        }
    }
}
function publisUserListDetails({ listId }) {
    validate();
    this.autorun(autorun);
    return;
    
    function validate() {
         new SimpleSchema({
            listId: ML.fields.id
        }).validate({ listId });
    }
    function autorun(compution) {
        if (!this.userId) {
            return this.ready();
        } else {
            const userListsSelector = getUserListsSelector(this.userId);
            const listSelector = { _id: listId };
            
            return Lists.find({
                $and: [
                    listSelector,
                    userListsSelector
                ]
            }, Lists.publicFields);
        }
    }
}