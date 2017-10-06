const ClientAdapter = require('./ClientAdapter');
const config = require('./../Config');
const request = require('request-promise');
const jwtStrategy = require('login.dfe.jwt-strategies');

class HotConfigClientAdapter extends ClientAdapter {
  async get(id) {
    const clients = await allClients();
    return clients.find(async c => await c.client_id.toLowerCase() === id.toLowerCase());
  }
}

module.exports = HotConfigClientAdapter;


async function allClients() {
  const token = await jwtStrategy(config.hotConfig).getBearerToken();

  const options = {
    uri: `${config.hotConfig.url}/oidcclients`,
    headers: {
      authorization: `bearer ${token}`,
    },
  };

  if (config.hostingEnvironment.env === 'dev') {
    options.strictSSL = false;
  }

  const json = await request(options);
  return JSON.parse(json);
}
