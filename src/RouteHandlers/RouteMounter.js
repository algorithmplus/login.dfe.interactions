const loginHandler = require('./LoginHandler');
const interactionCompleteHandler = require('./InteractionCompleteHandler');

class RouteMounter {
    static init(app) {
        app.get('/interactioncomplete', interactionCompleteHandler.handle);

        app.post('/login', loginHandler.handle);
    }
}

module.exports = RouteMounter;