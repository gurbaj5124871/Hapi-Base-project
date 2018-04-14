const bluebird = require('bluebird')
const mongoose = bluebird.promisifyAll(require('mongoose'))

const serverConfig = require('../server-config')
const log = console.log
mongoose.Promise = bluebird

function dbConnect() {
    mongoose.connect(serverConfig.get('/mongodb/uri'))
        .then(() => {
            log('MongoDB Connected at: ', serverConfig.get('/mongodb/uri'))
        })
        .catch(err => {
            log('Error in database bootstraping, err: ', err)
            process.exit(1)
        })

    if (process.env.MONGO_DEBUG === 'true')
        mongoose.set('debug', true)
}

function exitFunction() {
    mongoose.disconnect(err => {
        if (err)
            log(err)
        log('Database disconnection')
        process.exit(1);
    })
}

process.on('SIGINT', () => {
    setTimeout(exitFunction, 2000)
})

module.exports = dbConnect