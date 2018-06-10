const Joi = require('joi')

const appConfig = require('./../configs/app-config')
const crtls = require('../controllers')
const commFunc = require('../common-functions')

const customerRoutes = [
    {
        method: 'POST',
        path: '/customer/register',
        handler: async (request, h) => {
            const payload = request.payload
            const headers = request.headers
            const remoteIP = request.info.remoteAddress
            try {
                const data = await crtls.customerController.registerCustomer(headers, payload, remoteIP)
                return commFunc.sendSuccess(data)
            }
            catch (e) {
                return e
            }
        },
        config: {
            description: 'Register a new customer',
            tags: ['api', 'customer'],
            payload: {
                maxBytes: 5000000,
                parse: true,
                output: 'file',
            },
            validate: {
                headers: Joi.object({
                    'content-language': Joi.string().required().description('en/ar'),
                    utcoffset: Joi.number().required().description('utc offset'),
                }).unknown(),
                payload: {
                    firstName: Joi.string().trim().min(1).required(),
                    lastName: Joi.string().trim().min(1).optional(),
                    email: Joi.string().email().required(),
                    password: Joi.string().min(4).required().description('password must contain minimum 4 character'),
                    mobile: Joi.string().regex(/^[0-9]+$/).min(5).required(),
                    countryCode: Joi.string().regex(/^[0-9,+]+$/).trim().min(2).required(),
                    countryISOCode: Joi.string().optional(),
                    deviceType: Joi.string().required().description('type of the device current using')
                        .valid([
                            appConfig.get('/deviceType/web'),
                            appConfig.get('/deviceType/ios'),
                            appConfig.get('/deviceType/android')
                        ]),
                    deviceToken: Joi.string().default(''),
                    image: Joi.any().meta({ swaggerType: 'file' }).optional(),
                },
                failAction: commFunc.swaggerFailAction,
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                    responseMessages: appConfig.get('/swaggerDefaultResponseMessages'),
                }
            }
        }
    }
]

module.exports = customerRoutes