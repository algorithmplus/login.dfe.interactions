const config = require('./../Config')();

let adapter;

if (config.access.type === 'api') {
  adapter = require('./api');
} else if (config.access.type === 'static') {
  adapter = require('./static');
}

module.exports = adapter;
