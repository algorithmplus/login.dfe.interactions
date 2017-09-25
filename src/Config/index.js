const userService = require('./../Users/UserService');
const fs = require('fs');

module.exports = {
  loggerSettings: {
    levels: {
      info: 0,
      ok: 1,
      error: 2
    },
    colors: {
      info: 'red',
      ok: 'green',
      error: 'yellow'
    }
  },
  hostingEnvironment: {
    env: process.env.NODE_ENV ? process.env.NODE_ENV : 'dev',
    host: process.env.HOST ? process.env.HOST : 'localhost',
    port: process.env.PORT ? process.env.PORT : 4431,
    protocol: (process.env.NODE_ENV ? process.env.NODE_ENV : 'dev') == 'dev' ? 'https' : 'http'
  },
  oidcService: {
    url: process.env.OIDC_BASE_URL ? process.env.OIDC_BASE_URL : 'https://localhost:4430'
  },
  crypto: {
    signing: {
      publicKey: fs.readFileSync('./ssl/localhost.cert', 'utf8'),
      privateKey: fs.readFileSync('./ssl/localhost.key', 'utf8')
    }
  },
  services: {
    user: new userService()
  }
};