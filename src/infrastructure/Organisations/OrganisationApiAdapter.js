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

const getOrganisationByExternalId = async (organisationId, orgType, correlationId) => {
  const token = await jwtStrategy(config.organisations.service).getBearerToken();

  try {
    const org = await rp({
      method: 'GET',
      uri: `${config.organisations.service.url}/organisations/by-external-id/${orgType}/${organisationId}`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      json: true,
    });

    return {
      id: org.id,
    };
  } catch (e) {
    const status = e.statusCode ? e.statusCode : 500;
    if (status === 404) {
      return null;
    }
    throw e;
  }
};

module.exports = {
  getOrganisationByExternalId,
};
