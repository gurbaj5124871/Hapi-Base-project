const Hapi = require('hapi')
const isPortFree = require('is-port-free');

const Plugins = require('./plugins')
console.log('Plugins: ',Plugins)
//const Routes = require('./routes')

const server = new Hapi.server({ host:'localhost', port:8000 });

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
