const ClientAdapter = require('./ClientAdapter');
const config = require('./../Config');
const request = require('request-promise');
const jwtStrategy = require('login.dfe.jwt-strategies');
const assert = require('assert');

class HotConfigClientAdapter extends ClientAdapter {
  async get(id) {
    assert(id, 'Client ID not specified');
    const clients = await this.allClients();
    return clients.find(c => c.client_id.toLowerCase() === id.toLowerCase());
  }
  async allClients() {
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
}

module.exports = HotConfigClientAdapter;


