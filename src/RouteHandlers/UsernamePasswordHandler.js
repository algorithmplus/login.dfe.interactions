const cacheProvider = require('./../Caching/MemoryCache');
const cache = new cacheProvider();

class UsernamePasswordHandler {
    static async  handle(req, res) {
        const uuid = req.query.uuid;
        const username = !req.body.username ? '' : req.body.username;
        const password = !req.body.password ? '' : req.body.password;
        const uid = await _authenticate(username, password);

        if (uid != null) {
            await cache.set(uuid, {uid: uid});

            res.redirect(`/interactioncomplete?uuid=${uuid}`);
        }
        else {
            res.redirect(`/usernamepassword?uuid=${uuid}&message=invalid%20username%20or%20password`)
        }
    }
}

module.exports = UsernamePasswordHandler;


async function _authenticate(username, password) {
    if (username.toLowerCase() != 'foo@example.com' || password.length == 0) {
        return Promise.resolve(null);
    }
    return Promise.resolve('23121d3c-84df-44ac-b458-3d63a9a05497');
}