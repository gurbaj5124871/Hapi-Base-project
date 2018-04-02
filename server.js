const Hapi = require('hapi')
const isPortFree = require('is-port-free');

const Config = require('./server-config')
const Plugins = require('./plugins')
//const Routes = require('./routes')

const server = new Hapi.server({
  port: 8000,
  cache: [
    {
      name: 'mongoCache',
      engine: require('catbox-mongodb'),
      host: '127.0.0.1',
      partition: 'cache'
    },
    {
      name: 'redisCache',
      engine: require('catbox-redis'),
      host: '127.0.0.1',
      partition: 'cache'
    }
  ]
});

// Initilizing server setup
(async () => {
  try {
    
    // Checking if the port is free
    await isPortFree(8000);
      
    // Registering plugins
    await server.register(Plugins);

    // // // registering routes
    // // server.route(Routes)

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
      
  } catch (err) {
    console.log(err)
    process.exit(0)
  }
})();

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});
