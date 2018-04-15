// CRUD Services for mongodb
const model = require('../models')

const createOne = async (modelName, doc) => {
    return new model[modelName](doc).saveAsync()
}

const insertMany = async (modelName, docs) => {
    return new Promise((res, rej) => { model[modelName].insertMany(docs, (e, data) => { if (e) { rej(e) } else { res(data) } }) })
}

const find = async(modelName, criteria, projection, options) => {
    return model[modelName].findAsync(criteria, projection, options)
}

const findOne = async (modelName, criteria, projection, options) => {
    return model[modelName].findOneAsync(criteria, projection, options)
}

const count = async (modelName, criteria) => {
    return model[modelName].countAsync(criteria)
}

const findOneAndUpdate = async (modelName, criteria, updation, options) => {
    return model[modelName].findOneAndUpdateAsync(criteria, updation, options)
}

const update = async (modelName, criteria, updation, options) => {
    options.multi = true
    return model[modelName].updateAsync(criteria, updation, options)
}

const findOneAndRemove = async (modelName, criteria) => {
    return model[modelName].findOneAndRemoveAsync(criteria)
}

const deleteMany = async (modelName, criteria) => {
    return model[modelName].deleteManyAsync(criteria);
}

const aggregate = async (modelName, pipeline) => {
    return model[modelName].aggregateAsync(pipeline)
}

const bulkWrite = async (modelName, operations, options) => {
    const opts = Object.extend({}, options || {})
    opts.ordered = (typeof opts.ordered == 'boolean') ? opts.ordered : true
    return model[modelName].bulkWrite(operations, opts)
}

const findStream = async (modelName, pipeline) => {
    return model[modelName].findAsync(pipeline).cursor().exec().stream()
}

const aggregateStream = async (modelName, pipeline) => {
    return model[modelName].aggregate(pipeline).cursor().exec().stream()
}

const insertManyWithPopulate = async (modelName, arrayToSave, populateOptions) => {
    return new Promise((res, rej) => {
        model[modelName].insertMany(arrayToSave, (e, docs) => { if (e) { rej(e) } else { model[modelName].populate(docs, populateOptions, (e, data) => { if (e) { rej(err) } else { res(data) } }) } })
    })
}

module.exports = {
    createOne,
    insertMany,
    find,
    findOne,
    count,
    findOneAndUpdate,
    update,
    findOneAndRemove,
    deleteMany,
    aggregate,
    bulkWrite,
    findStream,
    aggregateStream,
    insertManyWithPopulate
}