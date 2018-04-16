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

const authenticate = async (username, password, correlationId) => {
  const token = await jwtStrategy(config.directories.service).getBearerToken();

  try {
    const userId = await rp({
      method: 'POST',
      uri: `${config.directories.service.url}/users/authenticate`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      body: {
        username,
        password,
      },
      json: true,
    });

    return {
      id: userId,
    };
  } catch (e) {
    const status = e.statusCode ? e.statusCode : 500;
    if (status === 403 && e.error && e.error.reason_code === 'ACCOUNT_DEACTIVATED') {
      return {
        status: 'Deactivated',
      };
    }
    if (status === 403) {
      return null;
    }
    throw e;
  }
};

const find = async (username, correlationId) => {
  const token = await jwtStrategy(config.directories.service).getBearerToken();

  try {
    const res = await rp({
      method: 'GET',
      uri: `${config.directories.service.url}/users/${username}`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      json: true,
    });

    return {
      sub: res.sub,
      email: res.email,
      given_name: res.given_name,
      family_name: res.family_name,
    };
  } catch (e) {
    const status = e.statusCode ? e.statusCode : 500;
    if (status === 404) {
      return null;
    }
    throw new Error(e);
  }
};

const changePassword = async (uid, password, correlationId) => {
  const token = await jwtStrategy(config.directories.service).getBearerToken();

  try {
    await rp({
      method: 'POST',
      uri: `${config.directories.service.url}/users/${uid}/changepassword`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      body: {
        password,
      },
      json: true,
    });
  } catch (e) {
    throw new Error(e);
  }
};

const getDevices = async (uid, correlationId) => {
  const token = await jwtStrategy(config.directories.service).getBearerToken();

  try {
    return await rp({
      method: 'GET',
      uri: `${config.directories.service.url}/users/${uid}/devices`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      json: true,
    });
  } catch (e) {
    const status = e.statusCode ? e.statusCode : 500;
    if (status === 404) {
      return null;
    }
    throw e;
  }
};

const create = async (username, password, firstName, lastName, correlationId) => {
  const token = await jwtStrategy(config.directories.service).getBearerToken();

  try {
    return await rp({
      method: 'POST',
      uri: `${config.directories.service.url}/users`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      body: {
        username,
        password,
        firstName,
        lastName,
      },
      json: true,
    });
  } catch (e) {
    const status = e.statusCode ? e.statusCode : 500;
    if (status === 409) {
      return null;
    }
    throw e;
  }
};

module.exports = {
  authenticate,
  find,
  changePassword,
  getDevices,
  create,
};
