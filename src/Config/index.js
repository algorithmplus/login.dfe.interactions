const userService = require('./../Users/UserService');
const fs = require('fs');

const createConfig = (env) => {
  const isDev = (env || 'dev') === 'dev';
  return {
    loggerSettings: {
      levels: {
        info: 0,
        ok: 1,
        error: 2,
      },
      colors: {
        info: 'red',
        ok: 'green',
        error: 'yellow',
      },
    },
    hostingEnvironment: {
      env: env || 'dev',
      host: process.env.HOST ? process.env.HOST : 'localhost',
      port: process.env.PORT ? process.env.PORT : 4431,
      protocol: isDev ? 'https' : 'http',
    },
    oidcService: {
      url: process.env.OIDC_BASE_URL ? process.env.OIDC_BASE_URL : 'https://localhost:4430',
    },
    crypto: {
      signing: {
        publicKey: isDev ? fs.readFileSync('./ssl/localhost.cert', 'utf8') : '',
        privateKey: isDev ? fs.readFileSync('./ssl/localhost.key', 'utf8') : '',
      },
    },
    services: {
      user: new userService(),
    },
  };
};

module.exports = createConfig(process.env.NODE_ENV);
