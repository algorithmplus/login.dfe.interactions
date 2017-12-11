const config = require('./../Config')();

let adapter;

if (config.devices.type === 'api') {
  adapter = require('./devicesApi');
} else if (config.devices.type === 'static') {
  adapter = require('./static');
}

module.exports = adapter;