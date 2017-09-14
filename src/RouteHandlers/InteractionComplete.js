function _getPostbackUrl(uuid) {
    return `https://localhost:4430/interaction/${uuid}/complete`;
}
function _getUuidField(uuid) {
    return `<input name="uuid" type="hidden" value=${uuid} />`;
}
function _getUidField(uid) {
    return `<input name="uid" type="hidden" value=${uid} />`;
}

class InteractionComplete {
    static handle(req, res) {
        const uuid = req.query.uuid;
        const uid = req.query.uid;

        const postbackUrl = _getPostbackUrl(uuid);
        const fields = _getUuidField(uuid)
                     + _getUidField(uid);

        res.set('Content-Type', 'text/html');
        res.send(`<html><body><form id="cbform" action="${postbackUrl}" method="post">${fields}</form><script>document.getElementById("cbform").submit();</script></body></html>`);
    }



}

module.exports = InteractionComplete;