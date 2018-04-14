const Confidence = require('confidence');

const criteria = {
    env: process.env.NODE_ENV
}

const config = {
    host: {
        $filter: 'env',
        dev: '127.0.0.1',
        test: '127.0.0.1',
        staging: '127.0.0.1',
        production: '127.0.0.1',
        $default: 'localhost'
    },
    port: {
        $filter: 'env',
        dev: 3001,
        test: 3000,
        staging: 3000,
        production: process.env.PORT || 3003,
        $default: 3001,
    },
    
    swaggerInfo: {
        $filter: 'env',
        dev: {
            title: 'Gurbaj Base Project V1',
            version: 'V1.0.0',
            contact: {
                name: 'Gurbaj Singh',
                email: 'singh.gurbaj5124871@gmail.com',
            }
        },
        test: {
            title: 'Gurbaj Base Project V1',
            version: 'V1.0.0',
            contact: {
                name: 'Gurbaj Singh',
                email: 'singh.gurbaj5124871@gmail.com',
            }
        },
        staging: {
            title: 'Gurbaj Base Project V1',
            version: 'V1.0.0',
            contact: {
                name: 'Gurbaj Singh',
                email: 'singh.gurbaj5124871@gmail.com',
            }
        },
        production: {
            title: 'Gurbaj Base Project V1',
            version: 'V1.0.0',
            contact: {
                name: 'Gurbaj Singh',
                email: 'singh.gurbaj5124871@gmail.com',
            }
        },
        $default: {
            title: 'Gurbaj Base Project V1',
            version: 'V1.0.0',
            contact: {
                name: 'Gurbaj Singh',
                email: 'singh.gurbaj5124871@gmail.com',
            }
        }
    },
    swaggerDocumentationPage: {
        $filter: 'env',
        production: false,
        $default: true,
    },

    mongodb: {
        uri: {
            $filter: 'env',
            production: `mongodb://${process.env.MONGO_USER || ''}:${process.env.MONGO_PASS || ''}@${process.env.MONGO_HOST || '127.0.0.1'}:27017/${process.env.MONGO_DBNAME_LIVE || 'gurbaj-base-live'}`,
            staging: `mongodb://${process.env.MONGO_USER || ''}:${process.env.MONGO_PASS || ''}@${process.env.MONGO_HOST || '127.0.0.1'}:27017/${process.env.MONGO_DBNAME_STAGING || 'gurbaj-base-staging'}`,
            test: `mongodb://${process.env.MONGO_USER || ''}:${process.env.MONGO_PASS || ''}@${process.env.MONGO_HOST || '127.0.0.1'}:27017/${process.env.MONGO_DBNAME_TEST || 'gurbaj-base-test'}`,
            dev: `mongodb://${process.env.MONGO_USER || ''}:${process.env.MONGO_PASS || ''}@${process.env.MONGO_HOST || '127.0.0.1'}:27017/${process.env.MONGO_DBNAME_DEV || 'gurbaj-base-dev'}`,
            $default: 'mongodb://127.0.0.1:27017/gurbaj-base',
        }
    },

    
}

// Caching server configs and constants
const store = new Confidence.Store(config);

const get = (key, criteria) => {
    return store.get(key, criteria)
}

const meta = (key, criteria) => {
    return store.meta(key, criteria)
}

module.exports = { get, meta }