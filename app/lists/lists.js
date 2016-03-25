Lists = ML.createCollection('Lists', {
    name: { type: String },
    isPublic: { type: Boolean },
    ownerId: { type: String, regEx: SimpleSchema.RegEx.Id, denyUpdate: true },
    createdAt: { type: Date, denyUpdate: true },
    modifiedAt: { type: Date },
}, ['name', 'isPublic', 'ownerId']);

Lists.helpers({
    isEditableBy: listIsEditableBy
});

ML.createMethods(Lists, [
    {
        name: 'insert',
        fields: ['name', 'isPublic'],
        run: listsInsert
    }, {
        name: 'hasAccess',
        fields: [{ listId: ML.fields.id }],
        run: listsHasAccess
    }
]);

function listIsEditableBy(userId) {
    userId = userId || Meteor.userId();
    
    if (userId) {
        return this.ownerId === userId;
    }
    
    return false;
}
function listsInsert({name, isPublic}) {
    if (!this.userId) {
        throw new Meteor.Error('unauthorized', 'Must be logged in to create a new list');
    }
    
    return Lists.insert({
        name,
        isPublic,
        ownerId: this.userId,
        createdAt: new Date(),
        modifiedAt: new Date(),
    });
}
function listsHasAccess({ listId }) {
    if (!this.userId) {
        return false;
    } else {
        const list = Lists.findOne(listId);
        
        if (!list) {
            return false;
        } else {
            return list.isEditableBy(this.userId);
        }
    } 
}