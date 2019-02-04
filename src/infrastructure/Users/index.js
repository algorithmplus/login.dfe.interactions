const config = require('./../Config')();
const StaticUserAdapter = require('./StaticUserAdapter');
const DirectoriesApiUserAdapter = require('./DirectoriesApiUserAdapter');

const directoryType = (config && config.directories && config.directories.type) ? config.directories.type : 'static';

let adapter;
switch (directoryType.toLowerCase()) {
  case 'static':
    adapter = StaticUserAdapter;
    break;
  case 'api':
    adapter = DirectoriesApiUserAdapter;
    break;
  default:
    throw new Error(`Unsupported directory type ${directoryType}. Supported types are static or directoriesapi`);
}

module.exports = adapter;
