const cacheProvider = require('./../Caching/MemoryCache');
const cache = new cacheProvider();

class InteractionCompleteHandler {
    static async handle(req, res) {
        const uuid = req.query.uuid;

        const postbackUrl = _getPostbackUrl(uuid);
        const fields = _getUuidField(uuid)
            + await _getInteractionFields(uuid);

        res.set('Content-Type', 'text/html');
        res.send(`<html><body><form id="cbform" action="${postbackUrl}" method="post">${fields}</form><script>document.getElementById("cbform").submit();</script></body></html>`);
    }
}

module.exports = InteractionCompleteHandler;


function _getPostbackUrl(uuid) {
    return `https://localhost:4430/interaction/${uuid}/complete`;
}

function _getUuidField(uuid) {
    return `<input name="uuid" type="hidden" value="${uuid}" />`;
}

async function _getInteractionFields(uuid) {
    var data = await cache.get(uuid);
    var fields = '';
    if (data) {
        Object.keys(data).forEach((key) => {
            var value = data[key];
            fields += `<input name="${key}" type="hidden" value="${value}" />`;
        });
    }

    return fields;
}