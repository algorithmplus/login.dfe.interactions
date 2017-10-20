const rp = require('request-promise');
const jwtStrategy = require('login.dfe.jwt-strategies');
const config = require('../Config');

class UserCodesApiAdapter {
  async upsertCode(userId) {
    const token = await jwtStrategy(config.directories.service).getBearerToken();

    try {
      const user = await rp({
        method: 'PUT',
        uri: `${config.directories.service.url}/userCodes/upsert`,
        headers: {
          authorization: `bearer ${token}`,
        },
        body: {
          uid: userId,
        },
        json: true,
      });

      return {
        user,
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteCode(userId) {
    const token = await jwtStrategy(config.directories.service).getBearerToken();

    try {
      const user = await rp({
        method: 'DELETE',
        uri: `${config.directories.service.url}/userCodes/${userId}`,
        headers: {
          authorization: `bearer ${token}`,
        },
        json: true,
      });

      return {
        user,
      };
    } catch (e) {
      const status = e.statusCode ? e.statusCode : 500;
      if (status === 404) {
        return null;
      }
      throw new Error(e);
    }
  }

  async validateCode(userId, code) {
    const token = await jwtStrategy(config.directories.service).getBearerToken();

    try {
      const userCode = await rp({
        method: 'GET',
        uri: `${config.directories.service.url}/userCodes/validate/${userId}/${code}`,
        headers: {
          authorization: `bearer ${token}`,
        },
        body: {
          uid: userId,
        },
        json: true,
      });

      return {
        userCode,
      };
    } catch (e) {
      const status = e.statusCode ? e.statusCode : 500;
      if (status === 404) {
        return null;
      }
      throw new Error(e);
    }
  }
}

module.exports = UserCodesApiAdapter;
