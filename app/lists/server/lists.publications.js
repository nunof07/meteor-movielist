Meteor.publish('lists.user', publishLists);

function publishLists() {
    this.autorun(autorun);
    return;
    
    function autorun(compution) {
        if (!this.userId) {
            return this.ready();
        } else {
            const publicListSelector = { isPublic: true };
            const userIsOwnerSelector = { $and: [
                        { ownerId: this.userId },
                        { ownerId: { $exists: true } }
                    ] };
            
            return Lists.find({
                $or: [
                    publicListSelector,
                    userIsOwnerSelector
                ]
            }, Lists.publicFields);
        }
    }
} 