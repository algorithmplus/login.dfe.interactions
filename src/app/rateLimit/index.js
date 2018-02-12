const ExpressBrute = require('express-brute');
const RedisStore = require('express-brute-redis');
const Redis = require('redis');
const moment = require('moment');
const config = require('./../../infrastructure/Config')();
const logger = require('./../../infrastructure/logger');

let store;
if (config.hostingEnvironment.env === 'dev1') {
  store = new ExpressBrute.MemoryStore();
} else {
  const tls = config.hostingEnvironment.rateLimitUrl.includes('6380');
  const client = Redis.createClient({
    url: config.hostingEnvironment.rateLimitUrl,
    tls,
  });
  store = new RedisStore({
    client,
  });
}

const bruteforce = new ExpressBrute(store, {
  freeRetries: 3,
  minWait: 1000,
  maxWait: 30 * 1000,
  lifetime: 60 * 60,
  failCallback: (req, res, next, nextValidRequestDate) => {
    const now = moment();
    const later = moment(nextValidRequestDate);
    const diff = moment.duration(later.diff(now)).asSeconds();

    if (diff > 29) {
      logger.info(`Waited for over 29s - reset timer for ${req}`);
      req.brute.reset();
      next();
    } else {
      setTimeout(next, diff * 1000);
    }
  },
});

const rateLimiter = (req, res, next) => {
  if (req.method === 'POST') {
    bruteforce.prevent(req, res, next);
  } else {
    next();
  }
};

module.exports = rateLimiter;
