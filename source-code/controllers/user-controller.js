const boom = require('boom')
const bluebird = require('bluebird')
const bcrypt = bluebird.promisifyAll(require('bcrypt'))

const appConfig = require('../configs/app-config')
const mongoServices = require('../services/mongo-services')
const models = require('../models')
const services = require('../services')

const userLogin = async (headers, payload, remoteIP) => {
    try {
        const criteria = { isDeleted: false }

        if(payload.email)
        criteria.email = payload.email
        else criteria.mobile = payload.mobile 

        const projections = {
            passwordResetToken: 0, facebookId: 0, isDeleted: 0, mobileOTP: 0,
            changeMobile: 0, emailVerificationToken: 0, 
        }

        const user = await mongoServices.findOne(models.user, criteria, projections, { lean: true })

        if(!user)
        throw boom.badRequest('Invalid Email/Mobile Password')

        if(!await bcrypt.compare(payload.password, user.password))
        throw boom.badRequest('Invalid Email/Mobile Password')

        let currentRole = user.currentRole
        if(!currentRole)

        if(user.roles.includes(appConfig.get('/roles/customer')))
        currentRole = appConfig.get('/roles/customer')
        else if(user.roles.includes(appConfig.get('/roles/serviceProvider')))
        currentRole = appConfig.get('/roles/serviceProvider')
        else currentRole = user.roles[0]

        services.sessionServices.verifyUser({ user }, currentRole)

        const sess = await services.sessionServices.createUserSession(user._id, currentRole, remoteIP, payload.deviceType, payload.deviceToken)

        const token = await services.jwtServices.createAuthToken(sess._id, currentRole)

        delete user.password
        delete user.__v

        return { user, token }

    }
    catch (e) {
        throw e
    }
}

module.exports = {
    userLogin
}