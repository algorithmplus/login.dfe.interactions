const config = require('../Config')();
const StaticUserCodeAdapter = require('./StaticUserCodeAdapter');
const UserCodesApiAdapter = require('./UserCodesApiAdapter');

const userCodesType = (config && config.userCodes && config.userCodes.type) ? config.userCodes.type : 'static';

let adapter;
switch (userCodesType.toLowerCase()) {
  case 'static':
    adapter = new StaticUserCodeAdapter();
    break;
  case 'usercodesapi':
    adapter = new UserCodesApiAdapter();
    break;
  default:
    throw new Error(`Unsupported user code type ${userCodesType}. Supported types are static or usercodesapi`);
}

module.exports = adapter;
