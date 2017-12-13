const ExpressBrute = require('express-brute');
const moment = require('moment');
const config = require('./../../infrastructure/Config')();

const store = new ExpressBrute.MemoryStore(); // stores state locally, don't use this in production
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