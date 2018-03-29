'use strict';

const config = require('./../Config')();
const KeepAliveAgent = require('agentkeepalive').HttpsAgent;
const request = require('request-promise').defaults({
  agent: new KeepAliveAgent({
    maxSockets: config.hostingEnvironment.agentKeepAlive.maxSockets,
    maxFreeSockets: config.hostingEnvironment.agentKeepAlive.maxFreeSockets,
    timeout: config.hostingEnvironment.agentKeepAlive.timeout,
    keepAliveTimeout: config.hostingEnvironment.agentKeepAlive.keepAliveTimeout,
  }),
});
const jwtStrategy = require('login.dfe.jwt-strategies');
const assert = require('assert');
const logger = require('./../logger');

const allClients = async (reqId) => {
  const token = await jwtStrategy(config.hotConfig).getBearerToken();

  const options = {
    uri: `${config.hotConfig.url}/oidcclients`,
    headers: {
      authorization: `bearer ${token}`,
      'x-correlation-id': reqId,
    },
  };
  if (config.hostingEnvironment.env === 'dev') {
    logger.warn('allClients() - setting strictSSL to false');
    options.strictSSL = false;
  }
  const json = await request(options);
  return JSON.parse(json);
};


const get = async (id, reqId) => {
  assert(id, 'Client ID not specified');
  logger.info(`HotConfigClientAdapter:get() - fetching client config with id ${id} for request ${reqId}`);
  const clients = await allClients(reqId);
  const client = clients.find(c => c.client_id.toLowerCase() === id.toLowerCase());
  return client === undefined ? null : client;
};


module.exports = {
  get,
};
