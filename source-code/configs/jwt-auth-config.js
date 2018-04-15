const Confidence = require('confidence')
const fs = require('fs')

const config = {

    privateKey: fs.readFileSync(`${__dirname}/../../certs/jwtPrivate.pem`),
    publicKey: fs.readFileSync(`${__dirname}/../../certs/jwtPublic.pem`),
    
    doesTokenExpires: {
        $filter: 'role',
        admin: true,
        customer: false,
        driver: false,
        serviceProvider: true,
        $default: false        
    },
    
    tokenExpirationTime: {
        $filter: 'role',
        admin: '3 hours',
        customer: '30 days',
        driver: '30 days',
        serviceProvider: '30 days',
        $default: '3 hours'
    }

}

// Caching configs and constants
const store = new Confidence.Store(config);

const get = (key, criteria) => {
    if (criteria)
        return store.get(key, criteria)
    else return store.get(key)
}

const meta = (key, criteria) => {
    if (criteria)
        return store.meta(key, criteria)
    else store.meta(key)
}

module.exports = { get, meta }