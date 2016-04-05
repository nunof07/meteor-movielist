Lists = ML.createCollection('Lists', {
    name: { type: String },
    isPublic: { type: Boolean },
    ownerId: { type: String, regEx: SimpleSchema.RegEx.Id, denyUpdate: true },
    isDeleted: { type: Boolean, optional: true },
    createdAt: { type: Date, denyUpdate: true },
    modifiedAt: { type: Date },
}, ['name', 'isPublic', 'ownerId', 'isDeleted']);

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
    }, {
        name: 'update',
        fields: [{ listId: ML.fields.id }, 'name', 'isPublic'],
        run: listsUpdate
    }, {
        name: 'delete',
        fields: [{ listId: ML.fields.id }],
        run: listsDelete
    }
]);

function listIsEditableBy(userId) {
    userId = userId || Meteor.userId();
    
    if (!userId || this.isDeleted) {
        return false;
    } else if (this.isPublic) {
        return true;
    } else {
        return this.ownerId === userId;
    }
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
function listsUpdate({ listId, name, isPublic }) {
    if (!listsHasAccess.call(this, { listId })) {
        throw new Meteor.Error('unauthorized', 'User not authorized to update list');
    }
    
    return Lists.update(listId, { $set: {
        name,
        isPublic,
        modifiedAt: new Date(),
    } });
}
function listsDelete({ listId }) {
    if (!listsHasAccess.call(this, { listId })) {
        throw new Meteor.Error('unauthorized', 'User not authorized to update list');
    }
    
    return Lists.update(listId, { $set: {
        isDeleted: true,
        modifiedAt: new Date(),
    } });
}