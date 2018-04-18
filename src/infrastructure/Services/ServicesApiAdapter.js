const config = require('./../Config')();
const KeepAliveAgent = require('agentkeepalive').HttpsAgent;
const rp = require('request-promise').defaults({
  agent: new KeepAliveAgent({
    maxSockets: config.hostingEnvironment.agentKeepAlive.maxSockets,
    maxFreeSockets: config.hostingEnvironment.agentKeepAlive.maxFreeSockets,
    timeout: config.hostingEnvironment.agentKeepAlive.timeout,
    keepAliveTimeout: config.hostingEnvironment.agentKeepAlive.keepAliveTimeout,
  }),
});
const jwtStrategy = require('login.dfe.jwt-strategies');

const create = async (userId, serviceId, organisationId, orgType, correlationId) =>{
  const token = await jwtStrategy(config.organisations.service).getBearerToken();

  try {
    await rp({
      method: 'POST',
      uri: `${config.organisations.service.url}/organisations/${organisationId}/services/${serviceId}/create/${userId}`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      body: {
        org_type: orgType,
      },
      json: true,
    });

    return true;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  create,
};