const uuid = require('uuid/v4');

class DevRoutes {
  static register(app) {
    app.get('/', DevRoutes.launchPad);
    app.post('/dev/:uuid/complete', DevRoutes.completeCallback);
  }

  static launchPad(req, res) {
    res.render('dev/launchpad', {
      uuid: uuid()
    });
  }

  static completeCallback(req, res) {
    res.render('dev/complete', {data: req.body});
  }
}

module.exports = DevRoutes;