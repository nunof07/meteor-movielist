MovieScores = ML.createCollection('MovieScores', {
    movieId: { type: String, regEx: SimpleSchema.RegEx.Id, denyUpdate: true },
    count: { type: Number, min: 0 },
    total: { type: Number, min: 0 },
    average: { type: Number, min: 1, max: 5, decimal: true, optional: true },
    createdAt: { type: Date, denyUpdate: true },
    modifiedAt: { type: Date },
}, ['movieId', 'count', 'total', 'average']);