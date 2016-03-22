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
    }
]);

function listIsEditableBy() {
    if (Meteor.userId()) {
        return this.ownerId === Meteor.userId();
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