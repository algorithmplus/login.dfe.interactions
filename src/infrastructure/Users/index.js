const config = require('./../Config')();

const directoryType = (config && config.directories && config.directories.type) ? config.directories.type : 'static';

let adapter;
switch (directoryType.toLowerCase()) {
  case 'static':
    adapter = require('./StaticUserAdapter');
    break;
  case 'api':
    adapter = require('./DirectoriesApiUserAdapter');
    break;
  default:
    throw new Error(`Unsupported directory type ${directoryType}. Supported types are static or directoriesapi`);
}

module.exports = adapter;
