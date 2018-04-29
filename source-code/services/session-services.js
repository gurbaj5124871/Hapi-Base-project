const boom = require('boom')
const models = require('./../models')
const mongoServices = require('./mongo-services')
const appConfig = require('./../configs/app-config')

//const createUserSession = async 

const getSessionDetails = async sessionID => {
    try {
        const sess = await mongoServices.findOne(models.session, { _id: sessionID }, { __v: 0 }, {
            lean: true,
            populete: [{ path: 'user' }, { path: 'admin' }]
        })

        if (!sess)
            throw boom.unauthorized('Session Expired')

        return sess
    }
    catch (e) {
        throw e
    }
}

const verifyUserSession = async (sessionID, role) => {
    try {
        const sess = await getSessionDetails(sessionID)

        if (!sess.user)
            throw boom.unauthorized('Session Expired')

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

        if (role === appConfig.get('/roles/customer') && !sess.user.customer)
            throw boom.badRequest('Email/Password Incorrect')

        if (role === appConfig.get('/roles/customer') && sess.user.customer.isBlocked)
            throw boom.badRequest('Your Account is Blocked. Please contact admin')

        if (role === appConfig.get('/roles/driver') && !sess.user.driver)
            throw boom.badRequest('Email/Password Incorrect')

        if (role === appConfig.get('/roles/driver') && sess.user.driver.isBlocked)
            throw boom.badRequest('Your Account is Blocked. Please contact admin')

        if (role === appConfig.get('/roles/serviceProvider') && !sess.user.serviceProvider)
            throw boom.badRequest('Email/Password Incorrect')

        if (role === appConfig.get('/roles/serviceProvider') && sess.user.serviceProvider.isBlocked)
            throw boom.badRequest('Your Account is Blocked. Please contact admin')

        return sess

    }
    catch (e) {
        throw e
    }
}

const verifyAdminSession = async (sessionID, role) => {
    try {
        const sess = await getSessionDetails(sessionID)

        if (!sess.admin)
            throw boom.unauthorized('Session Expired')

        if (sess.admin.isDeleted && !sess.admin.isSuperAdmin)
            throw boom.badRequest('Your Account is Deactivated. Please contact super admin')

        if (sess.admin.isBlocked && !sess.admin.isSuperAdmin)
            throw boom.badRequest('Your Account is Blocked. Please contact admin')

        if (!sess.admin.isAdminVerified && !sess.admin.isSuperAdmin)
            throw boom.badRequest('Your Account is not admin verified yet. Please contact admin')

        return sess
    }
    catch (e) {
        throw e
    }
}

const updateSession = async (sessionID, deviceType, deviceToken) => {
    try {
        const sess = await mongoServices.findOneAndUpdate(models.session, { _id: sessionID }, {
            $set: { deviceType, deviceToken }
        }, {
                lean: true, new: true,
                populete: [{ path: 'user' }, { path: 'admin' }]
            })

        if (!sess)
            throw boom.unauthorized('Session Expired')

        return sess
    }
    catch (e) {
        throw e
    }
}

module.exports = {
    verifyUserSession,
    verifyAdminSession,
    getSessionDetails,
    updateSession
}