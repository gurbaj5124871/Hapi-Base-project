const Joi = require('joi')
const lodash = require('lodash')
const boom = require('boom')

const appConfig = require('./../configs/app-config')
const crtls = require('../controllers')
const commFunc = require('../common-functions')

const userRoutes = [
    {
        method: 'POST',
        path: '/user/login',
        handler: async (request, h) => {
            const payload = request.payload
            const headers = request.headers
            const remoteIP = request.info.remoteAddress
            try {
                const data = await crtls.userController.userLogin(headers, payload, remoteIP)
                return commFunc.sendSuccess(data)
            } catch (e) {
                console.log(e)
                return e
            }
        },
        config: {
            description: 'Login Via Email & Password For User',
            tags: ['api', 'User'],
            validate: {
                headers: Joi.object({
                    'content-language': Joi.string().required().description('en/ar'),
                    utcoffset: Joi.number().required().description('utc offset'),
                }).unknown(),
                payload: {
                    email: Joi.string().lowercase().email().optional(),
                    mobile: Joi.string().regex(/^[0-9]+$/).min(5).optional(),
                    role: Joi.string().optional().description('type of the user')
                        .valid([
                            appConfig.get('/roles/customer'),
                            appConfig.get('/roles/driver'),
                            appConfig.get('/roles/serviceProvider')
                        ]),
                    password: Joi.string().required(),

                    deviceToken: Joi.string().optional().allow(''),
                    deviceType: Joi.string().required().description('type of the device current using')
                        .valid([
                            appConfig.get('/deviceType/web'),
                            appConfig.get('/deviceType/ios'),
                            appConfig.get('/deviceType/android')
                        ])
                },
                failAction: commFunc.swaggerFailAction,
            },
            pre: [
                {
                    assign: 'payloadValidate',
                    method: async (request, h) => {
                        const payload = request.payload
                        if(!lodash.has(payload, 'email') && !lodash.has(payload, 'mobile'))
                        return boom.badRequest('Email/Mobile is required')
                        return true
                    }
                }
            ],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                    responseMessages: appConfig.get('/swaggerDefaultResponseMessages'),
                }
            }
        }
    }
]

module.exports = userRoutes