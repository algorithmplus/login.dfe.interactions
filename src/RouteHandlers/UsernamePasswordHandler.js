const cacheProvider = require('./../Caching/MemoryCache');
const cache = new cacheProvider();

class UsernamePasswordHandler {
    static async handle(req, res) {
        const uuid = req.query.uuid;
        const uid = 'zsh';

        await cache.set(uuid, {uid: uid});

        res.redirect(`/interactioncomplete?uuid=${uuid}`);
    }
}

module.exports = UsernamePasswordHandler;

