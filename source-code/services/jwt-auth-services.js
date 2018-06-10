const bluebird = require('bluebird')
const jwt = bluebird.promisifyAll(require('jsonwebtoken'))
const fs = require('fs')

const jwtConfig = require('../configs/jwt-auth-config')
const privateKey = fs.readFileSync(`${__dirname}/../../certs/jwtPrivate.pem`)
const publicKey = fs.readFileSync(`${__dirname}/../../certs/jwtPublic.pem`)

const createAuthToken = async (sessionID, role) => {
    const data = { sessionID, role }
    data.createdAt = new Date().toISOString()
    const opts = { algorithm: 'RS256' }

    if (jwtConfig.get('/doesTokenExpires', { role: data.scope }))
        opts.notBefore = jwtConfig.get('/tokenExpirationTime', { role: data.scope })

    return token = jwt.signAsync(data, privateKey, opts)
}

const verifyAuthToken = async token => {
    try{
        return tokenData = jwt.verifyAsync(token, publicKey)
    }
    catch(e){
        throw boom.unauthorized('Token is invalid')
    }
}

module.exports = {
    createAuthToken,
    verifyAuthToken
}


