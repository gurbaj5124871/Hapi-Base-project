const Confidence = require('confidence');

const config = {

    roles: {
        superAdmin: 'superAdmin',
        admin: 'admin',
        customer: 'customer',
        driver: 'driver',
        serviceProvider: 'serviceProvider',
    },

    deviceType: {
        android: 'android',
        ios: 'ios',
        web: 'web'
    },

    isSessionSelfExpiry: false,

    lang: {
        $filter: 'lang',
        en: 'en',
        jap: 'jap',
        chi: 'chi',
        ar: 'ar',
        $default: 'en'
    },

    social: {
        facebook: 'Facebook',
        google: 'Google',
        linkedIn: 'LinkedIn',
        twitter: 'Twitter',
    },

    verifySocialUser: {
        facebook: 'https://graph.facebook.com/v2.10/me?access_token=',
        google: 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=',
    },

    emailVerifyUrl: {
        $filter: 'env',
        dev: 'http://localhost:3001/user/verifyEmail',
        test: 'http://localhost:3000/user/verifyEmail',
        staging: 'http://localhost:3000/user/verifyEmail',
        production: 'https://localhost:3003/user/verifyEmail',
        $default: 'http://localhost:3001/user/verifyEmail',
    },
    adminUrl: {
        $filter: 'env',
        dev: 'http://localhost:3001/#/setPassword',
        test: 'http://localhost:3000/#/setPassword',
        staging: 'http://localhost:3000/#/setPassword',
        production: 'https://localhost:3003/#/setPassword',
        $default: 'http://localhost:3001/#/setPassword',
    },
    resetPasswordUrl: {
        $filter: 'env',
        dev: 'https://localhost:3001/#/resetPassword',
        test: 'http://localhost:3000/#/resetPassword',
        staging: 'http://localhost:3000/#/resetPassword',
        production: 'https://localhost:3003/#/resetPassword',
        $default: 'http://localhost:3001/#/resetPassword',
    },

    swaggerDefaultResponseMessages: [
        {
          code: 200,
          message: 'OK',
        },
        {
          code: 400,
          message: 'Bad Request',
        },
        {
          code: 401,
          message: 'Unauthorized',
        },
        {
          code: 404,
          message: 'Data Not Found',
        },
        {
          code: 500,
          message: 'Internal Server Error',
        }
      ]

}

// Caching configs and constants
const store = new Confidence.Store(config);

const get = (key, criteria) => {
    if(criteria)
    return store.get(key, criteria)
    else return store.get(key)
}

const meta = (key, criteria) => {
    if(criteria)
    return store.meta(key, criteria)
    else store.meta(key)
}

module.exports = { get, meta }