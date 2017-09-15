const cacheProvider = require('./../Caching/MemoryCache');
const cache = new cacheProvider();

const crypto = require('crypto');
const fs = require('fs');
const privateKey = _readPrivateKey();


class InteractionCompleteHandler {
    static async handle(req, res) {
        const uuid = req.query.uuid;

        const postbackUrl = _getPostbackUrl(uuid);
        const postbackData = await _getPostbackData(uuid);
        const fields = _getFormFields(postbackData);

        res.set('Content-Type', 'text/html');
        res.send(`<html><body><form id="cbform" action="${postbackUrl}" method="post">${fields}</form><script>document.getElementById("cbform").submit();</script></body></html>`);
    }
}

module.exports = InteractionCompleteHandler;


function _getPostbackUrl(uuid) {
    let oidcBaseUrl = 'https://localhost:4430';
    if(process && process.env && process.env.OIDC_BASE_URL) {
        oidcBaseUrl = process.env.OIDC_BASE_URL;
    }
    return `${oidcBaseUrl}/interaction/${uuid}/complete`;
}
async function _getPostbackData(uuid) {
    let postbackData = {uuid};

    var cacheData = await cache.get(uuid);
    if (cacheData) {
        Object.keys(cacheData).forEach((key) => {
            var value = cacheData[key];
            postbackData[key]=value;
        });
    }

    var sig = _signData(postbackData);
    postbackData['sig'] = sig;

    return postbackData;
}
function _signData(postbackData) {
    const sign = crypto.createSign('RSA-SHA256');

    sign.write(JSON.stringify(postbackData));
    sign.end();

    var sig = sign.sign(privateKey, 'base64');
    return sig;
}
function _readPrivateKey() {
    return fs.readFileSync('./ssl/localhost.key', 'utf8');
}
function _getFormFields(postbackData) {
    var fields = '';
    Object.keys(postbackData).forEach((key) => {
        var value = postbackData[key];
        fields += `<input name="${key}" type="hidden" value="${value}" />`;
    });
    return fields;
}