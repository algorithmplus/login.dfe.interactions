const config = require('./../Config/index');
const StaticUserAdapter = require('./StaticUserAdapter');

const directoryType = config.directories.type;

let adapter;
switch(directoryType.toLowerCase())
{
  case 'static':
    adapter = new StaticUserAdapter();
    break;
  default:
    throw new Error(`Unsupported directory type ${directoryType}. Supported types are static or directoriesapi`)
}

module.exports = adapter;