const Hapi = require('hapi')
const isPortFree = require('is-port-free');

const Config = require('./server-config')
const Plugins = require('./plugins')
const Routes = require('./source-code/routes')
const bootstrap = require('./source-code/db-bootstraping')
const auth = require('./source-code/auth-strategies')

const log = console.log

const server = new Hapi.server({
  host: Config.get('/host'),
  port: Config.get('/port'),
  cache: [{
      name: 'mongoCache',
      engine: require('catbox-mongodb'),
      host: Config.get('/host'),
      partition: 'cache'
    },
    {
      name: 'redisCache',
      engine: require('catbox-redis'),
      host: Config.get('/host'),
      partition: 'cache'
    }
  ]
});

// Initilizing server setup
(async () => {
  try {

    // Checking if the port is free
    await isPortFree(Config.get('/port'));

    // Registering plugins
    await server.register(Plugins);

    // Initilizing autherization
    await auth(server)

    // registering routes
    server.route(Routes)

    // Initilizing database connection
    bootstrap()

    await server.start()
    log(`Server running at: ${server.info.uri}`);

    server.ext({
      type: 'onRequest',
      method(request, h) {
        log(`\nAPI METHOD: ${request.method}, PATH: ${request.path}\n\n`);
        log('>>> req.payload', request.payload)
        log('>>> req.query', request.query)
        return h.continue
      },
    })
  } catch (err) {
    log(err)
    process.exit(0)
  }
})();

process.on('unhandledRejection', (err) => {
  log(err);
  process.exit(1);
})

process.on('uncaughtException', (err) => {
  log(err);
  process.exit(1);
})