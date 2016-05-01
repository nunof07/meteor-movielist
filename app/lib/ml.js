ML = {};
ML.createCollection = createCollection;
ML.createMethods = createMethods;
ML.createDenormalizers = createDenormalizers;
ML.fields = {
    id: { type: String, regEx: SimpleSchema.RegEx.Id },
    string: { type: String }
};

function createCollection(name, fields, publicFields) {
    const collection = new Mongo.Collection(name);
    
    denyClientSideUpdates(collection);
    createSchema(collection, fields);
    createPublicFields(collection, publicFields);
    collection.methods = {};
    collection.denormalizers = {};
    collection.insertOrUpdate = insertOrUpdate;
    
    return collection;
    
    function denyClientSideUpdates(collection) {
        collection.deny({
            insert: denyAll,
            update: denyAll,
            remove: denyAll,
        });
        return collection;
        
        function denyAll() {
            return true;
        }
    }
    function createSchema(collection, fields) {
        collection.fields = fields;
        collection.schema = new SimpleSchema(collection.fields);
        collection.attachSchema(collection.schema);
        
        return collection.schema;
    }
    function createPublicFields(collection, publicFields) {
        collection.publicFields = {};
        
        for (let i = 0; i < publicFields.length; i++) {
            const field = publicFields[i];
            collection.publicFields[field] = 1;
        }
        
        return collection.publicFields;
    }
    function insertOrUpdate(findSelector, insertData, updateData) {
        const existing = this.findOne(findSelector);
        let returnId;
        
        if (existing) {
            // update existing
            this.update(findSelector, { $set: updateData });
            returnId = existing._id;
        } else {
            // create new one
            returnId = this.insert(insertData);
        }
        
        return returnId;
    }
}
function getSchema(collection, fieldNames) {
    const fields = getValidatorFields(collection, fieldNames);
    return new SimpleSchema(fields);
    
    function getValidatorFields(collection, fieldNames) {
        const result = {};
        
        for (let i = 0; i < fieldNames.length; i++) {
            const fieldName = fieldNames[i];
            
            if (_.isString(fieldName)) {
                const field = collection.fields[fieldName];
                result[fieldName] = field;
            } else {
                for (const property in fieldName) {
                    if (fieldName.hasOwnProperty(property)) {
                        result[property] = fieldName[property];
                        break;
                    }
                }
            }
        }
        
        return result;
    }
}
function createMethods(collection, declarations) {
    for (let i = 0; i < declarations.length; i++) {
        createMethod(collection,
            declarations[i].name,
            declarations[i].fields,
            declarations[i].run);
    }
    rateLimitMethods(collection);
    
    return collection;
}
function createMethod(collection, name, fieldNames, callback) {
    collection.methods[name] = new ValidatedMethod({
        name: collection._name + '.' + name,
        validate: getValidator(collection, fieldNames),
        run: methodBody
    });
    return collection.methods[name];
    
    function methodBody() {
        return callback.apply(this, arguments);
    }
    function getValidator(collection, fieldNames) {
        return getSchema(collection, fieldNames).validator();
    }
}
function rateLimitMethods(collection, numRequests, timeInterval) {
    numRequests = numRequests || 5;
    timeInterval = timeInterval || 1000;
    const methodNames = getMethodNames(collection);
    
    DDPRateLimiter.addRule({
        name: limitByName,
        connectionId: limitByConnectionId
    }, numRequests, timeInterval);
    return;
    
    function getMethodNames(collection) {
        const methodNames = [];
    
        for (const method in collection.methods) {
            if (collection.methods.hasOwnProperty(method)) {
                const name = collection.methods[method].name;
                methodNames.push(name);
            }
        }
        
        return methodNames;
    }
    function limitByName(name) {
        return _.contains(methodNames, name);
    }
    function limitByConnectionId() {
        return true;
    }
}
function createDenormalizers(collection, declarations) {
    for (let i = 0; i < declarations.length; i++) {
        createDenormalizer(collection,
            declarations[i].name,
            declarations[i].fields,
            declarations[i].run);
    }
    
    return collection;
}
function createDenormalizer(collection, name, fieldNames, callback) {
    const schema = getSchema(collection, fieldNames);
    collection.denormalizers[name] = denormalizer;
    return collection.denormalizers[name];
    
    function denormalizer() {
        schema.validate(arguments[0]);
        return callback.apply(this, arguments);
    }
}