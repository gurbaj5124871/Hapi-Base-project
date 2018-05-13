const boom = require('boom')
const bcrypt = require('bcrypt')

const appConfig = require('../configs/app-config')
const mongoServices = require('../services/mongo-services')
const models = require('../models')

const registerCustomer = async (headers, payload, remoteIP) => {
    try {
        const preCheck = await customerExistanceCheck(payload.email, payload.mobile)

        if(preCheck.isCustomer || ( preCheck.isUser && (!preCheck.emailMatched || !preCheck.mobileMatched) ) )
        throw boom.badRequest('Email/Mobile already in use')

        let user = {}

        // Creating User
        if(!preCheck.isUser) {

            payload.roles = [appConfig.get('/roles/customer')]
            payload.currentRole = appConfig.get('/roles/customer')
            payload.customer = { customerID: 1 }
            payload.mobileOTP = 1111
            payload.otpUpdatedAt = new Date()

            user = await mongoServices.createOne(models.user, payload)
        }
        // Updating User to Customer
        else {

            if(!await bcrypt.compare(user.password, payload.password))
            throw boom.badRequest('Email/Mobile already in use')

            let update = {
                $set: {
                    customer: { customerID: 1 },
                    currentRole: appConfig.get('/roles/customer')
                },
                $push: { roles: appConfig.get('/roles/customer') }
            }

            user = await mongoServices.findOneAndUpdate(models.user, { _id: preCheck.user._id }, {
                $set: { customer: payload }
            }, { lean: true, new: true })
        }

        await mongoServices.createOne(models.session, {
            user: user._id,
            remoteIP: payload.remoteIP,
            deviceType: payload.deviceType,
            deviceToken: payload.deviceToken,
            role: appConfig.get('/roles/customer')
        })

        delete user.password
        delete user.passwordResetToken
        delete user.emailVerificationToken
        delete user.mobileOTP
        delete user.__v

        return { user }
    }
    catch (e) {
        throw e
    }
}

async function customerExistanceCheck(email, mobile) {
    try {
        const criteria = {
            $and: [
                { isDeleted: false },
                {
                    $or: [{ email },
                    { mobile }]
                }
            ]
        }

        const user = await mongoServices.findOne(models.user, criteria, { roles: 1, email: 1, mobile: 1, password: 1 }, { lean: true })

        let resp = { isUser: false, isCustomer: false, emailMatched: false, mobileMatched: false, user }

        if (!user)
            return resp

        if (user) {
            resp.isUser = true

            if(email === user.email)
            resp.emailMatched = true

            if(mobile === user.mobile)
            resp.mobileMatched = true

            if (user.roles.map(i => {
                    if (i === appConfig.get('/roles/customer'))
                        return true
                }))
                resp.isCustomer = true

            return resp
        }
    }
    catch (e) {
        throw e
    }
}

module.exports = {
    registerCustomer,
    customerExistanceCheck
}
