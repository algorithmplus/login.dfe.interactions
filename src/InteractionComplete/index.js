const Config = require('./../Config');
const crypto = require('crypto');

class InteractionComplete {
  static process(uuid, data, res) {
    const postbackData = _buildPostbackData(uuid, data);

    res.render('interactioncomplete/index', {
      destination: `${Config.oidcService.url}/${uuid}/complete`,
      postbackData: postbackData,
      noredirect: (Config.hostingEnvironment.env == 'dev').toString()
    });
  }
}

module.exports = InteractionComplete;



function _buildPostbackData(uuid, data) {
  const postbackData = {uuid};

  if(data != null) {
    Object.keys(data).forEach((key) => {
      var value = data[key];
      postbackData[key] = value;
    });
  }

  postbackData.sig = _signData(postbackData);

  return postbackData;
}
function _signData(data) {
  const sign = crypto.createSign('RSA-SHA256');

  sign.write(JSON.stringify(data));
  sign.end();

  var sig = sign.sign(Config.crypto.signing.privateKey, 'base64');
  return sig;
}