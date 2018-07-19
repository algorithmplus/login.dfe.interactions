const config = require('./../Config')();

let adapter;
if (config.cache.type.toLowerCase() === 'redis') {
  adapter = require('./redis');
} else {
  adapter = require('./memory');
}

module.exports = adapter;
