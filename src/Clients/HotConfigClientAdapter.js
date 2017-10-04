const ClientAdapter = require('./ClientAdapter');
const config = require('./../Config');
const request = require('request-promise');
const jwtStrategy = require('login.dfe.jwt-strategies');

class HotConfigClientAdapter extends ClientAdapter {
  async get(id) {
    const clients = await _all();
    for(let i = 0; i < clients.length; i++){
      if(clients[i].client_id.toLowerCase() === id.toLowerCase()) {
        return clients[i];
      }
    }
    return null;
  }
}

module.exports = HotConfigClientAdapter;


async function _all() {
  const token = await jwtStrategy(config.hotConfig).getBearerToken();

  const options = {
    uri: config.hotConfig.url + '/oidcclients',
    headers:{
      authorization: `bearer ${token}`
    }
  };

  if(config.hostingEnvironment.env == 'dev') {
    options.strictSSL = false;
  }

  const json = await request(options);
  const clients = JSON.parse(json);
  return clients;
}