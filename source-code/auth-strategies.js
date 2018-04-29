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
                const session = await sessionServices.getSessionDetails(token.sessionID)
                return { isValid: true, session }
            }
            catch (e) {
                return { isValid: false, e }
            }
        }
    });

    server.auth.strategy('userAuth', 'bearer-access-token', {
        allowQueryToken: false,
        allowMultipleHeaders: true,
        accessTokenName: 'accessToken',
        validate: async (request, token, h) => {
            try {
                const token = authServices.verifyAuthToken(token)
                const session = await sessionServices.verifyUserSession(token.sessionID, token.role)
                return { isValid: true, session }
            }
            catch (e) {
                return { isValid: false, e }
            }
        }
    })

    server.auth.strategy('adminAuth', 'bearer-access-token', {
        allowQueryToken: false,
        allowMultipleHeaders: true,
        accessTokenName: 'accessToken',
        validate: async (request, token, h) => {
            try {
                const token = authServices.verifyAuthToken(token)
                const session = await sessionServices.verifyAdminSession(token.sessionID, token.role)

                return { isValid: true, session }
            }
            catch (e) {
                return { isValid: false, e }
            }
        }
    })

    server.auth.default('userAuth')

}

module.exports = autherization