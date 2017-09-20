const Config = require('./../Config');

const DevRoutes = require('./DevRoutes');
const UsernamePasswordRoutes = require('./../UsernamePassword/UsernamePasswordRoutes');

class Routes {
  static register(app) {
    UsernamePasswordRoutes.register(app);

    if(Config.hostingEnvironment.env == 'dev') {
      DevRoutes.register(app);
    }
  }
}

module.exports = Routes;