const boom = require('boom')
const models = require('./../models')
const mongoServices = require('./mongo-services')
const appConfig = require('./../configs/app-config')

//const createUserSession = async 

const getSessionDetails = async sessionID => {
    try {
        return await mongoServices.findOne(models.Session, { _id: sessionID }, { __v: 0 }, {
            lean: true,
            populete: [{ path: 'user' }, { path: 'admin' }]
        })
    }
    catch (e) {
        throw e
    }
}

const verifySession = async (sessionID, role) => {
    try {
        const sess = await getSessionDetails(sessionID)
        if (!sess)
            throw boom.unauthorized('Session Expired')

        if (role === appConfig.get('/roles/customer') ||
            role === appConfig.get('/roles/driver') ||
            role === appConfig.get('/roles/serviceProvider')) {
                
            if (sess.user.isDeleted)
                throw boom.badRequest('Your Account is Deactivated. Please contact admin')

            if (sess.user.isBlocked)
                throw boom.badRequest('Your Account is Blocked. Please contact admin')

            if (!sess.user.isAdminVerified)
                throw boom.badRequest('User not admin verified yet')

            if (!sess.user.isEmailVerified)
                throw boom.badRequest('Your email is not verified yet, Please verify your email Id')

            if (!sess.user.isPhoneVerified)
                throw boom.badRequest('Your Phone number is not verified yet, Please verify your Phone number')

            if(role === appConfig.get('/roles/customer') && !sess.user.customer)
                throw boom.badRequest('Email/Password Incorrect')
            
            if(role === appConfig.get('/roles/customer') && sess.user.customer.isBlocked)
                throw boom.badRequest('Your Account is Blocked. Please contact admin')
            
            if(role === appConfig.get('/roles/driver') && !sess.user.driver)
                throw boom.badRequest('Email/Password Incorrect')
            
            if(role === appConfig.get('/roles/driver') && sess.user.driver.isBlocked)
                throw boom.badRequest('Your Account is Blocked. Please contact admin')

            if(role === appConfig.get('/roles/serviceProvider') && !sess.user.serviceProvider)
                throw boom.badRequest('Email/Password Incorrect')
            
            if(role === appConfig.get('/roles/serviceProvider') && sess.user.serviceProvider.isBlocked)
                throw boom.badRequest('Your Account is Blocked. Please contact admin')

            return sess

        } else if (role === appConfig.get('/roles/admin')) {
            if (sess.admin.isDeleted && !sess.admin.isSuperAdmin)
                throw boom.badRequest('Your Account is Deactivated. Please contact admin')

            if (sess.admin.isBlocked && !sess.admin.isSuperAdmin)
                throw boom.badRequest('Your Account is Blocked. Please contact admin')

            if (!sess.admin.isAdminVerified && !sess.admin.isSuperAdmin)
                throw boom.badRequest('Your Account is not admin verified yet. Please contact admin')

            return sess
            
        } else throw boom.unauthorized('Session not found')

    }
    catch (e) {
        throw e
    }
}

module.exports = {
    verifySession
}