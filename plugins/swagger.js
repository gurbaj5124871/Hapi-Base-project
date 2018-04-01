const swagger = {
    plugin: require('hapi-swagger'),
    options: {
        info: {
            title: 'Gurbaj Base Project V1',
            version: 'V1.0.0',
            contact: {
                name: 'Gurbaj Singh',
                email: 'singh.gurbaj5124871@gmail.com',
            }
        },
        documentationPage: true,
        grouping: 'tags',
        schemes: ['http'],
        payloadType: 'form',
        debug: true,
        jsonEditor: true
    }
}

module.exports = swagger