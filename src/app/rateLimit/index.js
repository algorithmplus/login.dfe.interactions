const ExpressBrute = require('express-brute');
const RedisStore = require('express-brute-redis');
const moment = require('moment');
const config = require('./../../infrastructure/Config')();

let store;
if (config.hostingEnvironment.env === 'dev') {
  store = new ExpressBrute.MemoryStore();
} else {
  store = new RedisStore({
    host: config.hostingEnvironment.rateLimit.host,
    port: config.hostingEnvironment.rateLimit.port,
    password: config.hostingEnvironment.rateLimit.password,
  });
}

const bruteforce = new ExpressBrute(store, {
  freeRetries: 3,
  minWait: 1 * 1000,
  maxWait: 120 * 1000,
  lifetime: 24 * 60 * 60,
  failCallback: (req, res, next, nextValidRequestDate) => {
    const now = moment();
    const later = moment(nextValidRequestDate);
    const diff = moment.duration(later.diff(now)).asSeconds();

    setTimeout(next, diff * 1000);
  },
});

const rateLimiter = (req, res, next) => {
  if (req.method === 'GET') {
    next();
  } else {
    bruteforce.prevent(req, res, next);
  }
};

module.exports = rateLimiter;