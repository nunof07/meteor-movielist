Lists = new Mongo.Collection('Lists');

// deny all client-side updates
Lists.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});

// schema
Lists.fields = {
    name: { type: String },
    isPublic: { type: Boolean },
    ownerId: { type: String, regEx: SimpleSchema.RegEx.Id, denyUpdate: true },
    createdAt: { type: Date, denyUpdate: true },
    modifiedAt: { type: Date },
};
Lists.schema = new SimpleSchema(Lists.fields);
Lists.attachSchema(Lists.schema);

// public fields
Lists.publicFields = {
    name: 1,
    isPublic: 1,
    ownerId: 1
};

// helpers
Lists.helpers({
    isEditableBy() {
        if (Meteor.userId()) {
            return this.ownerId === Meteor.userId();
        }
        
        return false;
    }
});

// methods
Lists.methods = {};
Lists.methods.insert = new ValidatedMethod({
    name: 'Lists.methods.insert',
    validate: new SimpleSchema({
        name: Lists.fields.name,
        isPublic: Lists.fields.isPublic
    }).validator(),
    run({ name, isPublic }) {
        if (!this.userId) {
            throw new Meteor.Error('Lists.methods.insert.unauthorized',
                'Must be logged in to create a new list');
        }
        const list = {
            name,
            isPublic,
            ownerId: this.userId,
            createdAt: new Date(),
            modifiedAt: new Date(),
        };
        
        return Lists.insert(list);
    }
});

// list of all methods
const LISTS_METHODS = _.pluck([
    Lists.methods.insert
], 'name');

// only allow 5 operations per connection per second
DDPRateLimiter.addRule({
    name(name) {
        return _.contains(LISTS_METHODS, name);
    },

    // rate limit per connection ID
    connectionId() { return true; }
}, 5, 1000);