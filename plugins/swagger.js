const Config = require('../server-config')


const swagger = {
    plugin: require('hapi-swagger'),
    options: {
        info: Config.get('/swaggerInfo'),
        documentationPage: Config.get('/swaggerDocumentationPage'),
        grouping: 'tags',
        schemes: ['http'],
        payloadType: 'form',
        debug: true,
        jsonEditor: true
    }
}

module.exports = swagger