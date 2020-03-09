const config = require('./../Config')();
const rp = require('login.dfe.request-promise-retry');
const jwtStrategy = require('login.dfe.jwt-strategies');


const create = async (userId, serviceId, organisationId, externalIdentifiers = [], correlationId) => {
  const token = await jwtStrategy(config.organisations.service).getBearerToken();

  try {
    await rp({
      method: 'PUT',
      uri: `${config.organisations.service.url}/organisations/${organisationId}/services/${serviceId}/users/${userId}`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      body: {
        externalIdentifiers,
      },
      json: true,
    });

    return true;
  } catch (e) {
    const status = e.statusCode ? e.statusCode : 500;
    if (status === 403) {
      return false;
    }
    throw e;
  }
};

module.exports = {
  create,
};
