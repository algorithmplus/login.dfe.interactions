const Config = require('./../../infrastructure/Config')();
const { sendResult } = require('./../../infrastructure/utils');
const crypto = require('crypto');

const signData = (data) => {
  const sign = crypto.createSign('RSA-SHA256');

  sign.write(JSON.stringify(data));
  sign.end();

  return sign.sign(Config.crypto.signing.privateKey, 'base64');
};

const buildPostbackData = (uuid, data) => {
  const postbackData = { uuid };

  if (data !== null) {
    Object.keys(data).forEach((key) => {
      postbackData[key] = data[key];
    });
  }

  postbackData.sig = signData(postbackData);

  return postbackData;
};


class InteractionComplete {
  static process(uuid, data, req, res) {
    const postbackData = buildPostbackData(uuid, data);

    sendResult(req, res, 'InteractionComplete/views/index', {
      destination: `${Config.oidcService.url}/${uuid}/complete`,
      postbackData,
      noredirect: (Config.hostingEnvironment.env === 'dev').toString(),
    });
  }
}

module.exports = InteractionComplete;
