const config = require('./../Config')();

let adapter;

if (config.applications.type === 'api') {
  adapter = require('./api');
} else if (config.applications.type === 'static') {
  adapter = require('./static');
}

module.exports = adapter;
