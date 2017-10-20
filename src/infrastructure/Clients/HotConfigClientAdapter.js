'use strict';

const ClientAdapter = require('./ClientAdapter');
const config = require('./../Config')();
const request = require('request-promise');
const jwtStrategy = require('login.dfe.jwt-strategies');
const assert = require('assert');
const logger = require('./../logger');

const allClients = async () => {
  const token = await jwtStrategy(config.hotConfig).getBearerToken();

  const options = {
    uri: `${config.hotConfig.url}/oidcclients`,
    headers: {
      authorization: `bearer ${token}`,
    },
  };
  if (config.hostingEnvironment.env === 'dev') {
    logger.warn('allClients() - setting strictSSL to false');
    options.strictSSL = false;
  }
  const json = await request(options);
  return JSON.parse(json);
};

class HotConfigClientAdapter extends ClientAdapter {
  async get(id) {
    assert(id, 'Client ID not specified');
    logger.info(`HotConfigClientAdapter:get() - fetching client config with id ${id}`);
    const clients = await allClients();
    return clients.find(c => c.client_id.toLowerCase() === id.toLowerCase());
  }
}

module.exports = HotConfigClientAdapter;

