const jwt = require('jsonwebtoken')
const jwtConfig = require('../configs/jwt-auth-config')

const createAuthToken = async (sessionID, role) => {
    const data = { sessionID, role }
    data.createdAt = new Date().toISOString()
    const opts = { algorithm: 'RS256' }

    if (jwtConfig.get('/doesTokenExpires', { role: data.scope }))
        opts.notBefore = jwtConfig.get('/tokenExpirationTime', { role: data.scope })

    return token = jwt.sign(data, jwtConfig.get('/privateKey'), opts)
}

const verifyAuthToken = async token => {
    try{
        return tokenData = jwt.verify(token, jwtConfig.get('/publicKey'))
    }
    catch(e){
        throw boom.unauthorized('Token is invalid')
    }
}

module.exports = {
    createAuthToken,
    verifyAuthToken
}


