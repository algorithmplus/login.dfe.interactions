const config = require('./../Config')();
const StaticOsaAdapter = require('./StaticOsaAdapter');
const OsaApiAdapter = require('./OsaApiAdapter');

const osaType = (config && config.osaApi && config.osaApi.type) ? config.osaApi.type : 'static';

let adapter;
switch (osaType.toLowerCase()) {
  case 'static':
    adapter = StaticOsaAdapter;
    break;
  case 'api':
    adapter = OsaApiAdapter;
    break;
  default:
    throw new Error(`Unsupported old secure access type ${osaType}. Supported types are static or api`);
}

module.exports = adapter;
