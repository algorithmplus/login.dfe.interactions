const usernamePasswordHandler = require('./UsernamePasswordHandler');
const interactionCompleteHandler = require('./InteractionCompleteHandler');

class RouteMounter {
    static init(app) {
        app.get('/interactioncomplete', interactionCompleteHandler.handle);

        app.post('/usernamepassword', usernamePasswordHandler.handle);
    }
}

module.exports = RouteMounter;