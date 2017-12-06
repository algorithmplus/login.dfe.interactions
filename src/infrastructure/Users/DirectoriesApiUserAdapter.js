const rp = require('request-promise');
const jwtStrategy = require('login.dfe.jwt-strategies');
const config = require('./../Config')();


const authenticate = async (username, password, client) => {
  const token = await jwtStrategy(config.directories.service).getBearerToken();

  try {
    const userId = await rp({
      method: 'POST',
      uri: `${config.directories.service.url}/${client.params.directoryId}/user/authenticate`,
      headers: {
        authorization: `bearer ${token}`,
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
    if (status === 401) {
      return null;
    }
    throw e;
  }
};

const find = async (username, client) => {
  const token = await jwtStrategy(config.directories.service).getBearerToken();

  try {
    const res = await rp({
      method: 'GET',
      uri: `${config.directories.service.url}/${client.params.directoryId}/user/${username}`,
      headers: {
        authorization: `bearer ${token}`,
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

const changePassword = async (uid, password, client) => {
  const token = await jwtStrategy(config.directories.service).getBearerToken();

  try {
    await rp({
      method: 'POST',
      uri: `${config.directories.service.url}/${client.params.directoryId}/user/${uid}/changepassword`,
      headers: {
        authorization: `bearer ${token}`,
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

const getDevices = async (uid, client) => {
  const token = await jwtStrategy(config.directories.service).getBearerToken();

  try {
    return await rp({
      method: 'GET',
      uri: `${config.directories.service.url}/${client.params.directoryId}/user/${uid}/devices`,
      headers: {
        authorization: `bearer ${token}`,
      },
      json: true,
    });
  } catch (e) {
    const status = e.statusCode ? e.statusCode : 500;
    if (status === 404) {
      return null;
    }
    throw new Error(e);
  }
};

module.exports = {
  authenticate,
  find,
  changePassword,
  getDevices,
};
