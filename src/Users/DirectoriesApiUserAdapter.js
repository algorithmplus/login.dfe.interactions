const rp = require('request-promise');
const jwtStrategy = require('login.dfe.jwt-strategies');
const config = require('./../Config');

class DirectoriesApiUserAdapter {
  async authenticate(username, password, client) {
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
      throw new Error(e);
    }
  }
}

module.exports = DirectoriesApiUserAdapter;
