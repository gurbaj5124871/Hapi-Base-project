const Hapi = require('hapi')
const isPortFree = require('is-port-free');

const Config = require('./server-config')
const Plugins = require('./plugins')
const bootstrap = require('./source-code/db-bootstraping')

const log = console.log

const server = new Hapi.server({
  port: Config.get('/port'),
  // cache: [
  //   {
  //     name: 'mongoCache',
  //     engine: require('catbox-mongodb'),
  //     host: Config.get('/host'),
  //     partition: 'cache'
  //   },
  //   {
  //     name: 'redisCache',
  //     engine: require('catbox-redis'),
  //     host: Config.get('/host'),
  //     partition: 'cache'
  //   }
  // ]
});

// Initilizing server setup
(async () => {
  try {
    
    // Checking if the port is free
    await isPortFree(Config.get('/port'));
      
    // Registering plugins
    await server.register(Plugins);

    // // // registering routes
    // // server.route(Routes)

    // Initilizing database connection
    bootstrap()
    
    await server.start();
    log(`Server running at: ${server.info.uri}`);
      
  } catch (err) {
    log(err)
    process.exit(0)
  }
})();

process.on('unhandledRejection', (err) => {
  log(err);
  process.exit(1);
});
