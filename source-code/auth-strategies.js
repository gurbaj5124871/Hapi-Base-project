const authServices = require('./services/jwt-auth-services')
const mongoServices = require('./services/mongo-services')
const sessionServices = require('./services/session-services')

async function autherization(server) {

    await server.register(require('hapi-auth-bearer-token'))

    server.auth.strategy('preVerification', 'bearer-access-token', {
        allowQueryToken: false,
        allowMultipleHeaders: true,
        accessTokenName: 'accessToken',
        validate: async (request, token, h) => {
            try {
                const token = authServices.verifyAuthToken(token)
                return { isValid: true, token }
            }
            catch (e) {
                return { isValid: false, e }
            }
        }
    });

    server.auth.strategy('jwtAuth', 'bearer-access-token', {
        allowQueryToken: false,
        allowMultipleHeaders: true,
        accessTokenName: 'accessToken',
        validate: async (request, token, h) => {
            try {
                const token = authServices.verifyAuthToken(token)
                const session = sessionServices.verifySession(token.sessionID, token.role)
                return { isValid: true, session }
            }
            catch (e) {
                return { isValid: false, e }
            }
        }
    })

    server.auth.strategy('JwtAuthWithDeviceUpdate', 'bearer-access-token', {
        allowQueryToken: false,
        allowMultipleHeaders: true,
        accessTokenName: 'accessToken',
        validate: async (request, token, h) => {
            try {
                const token = authServices.verifyAuthToken(token)
                const session = sessionServices.verifySession(token.sessionID, token.role)
                return { isValid: true, session }
            }
            catch (e) {
                return { isValid: false, e }
            }
        }
    })

    server.auth.default('jwtAuth')

}

module.exports = autherization