const Config = require('./../Config');
const InteractionComplete = require('./../InteractionComplete');

class UsernamePasswordRoutes {
  static register(app) {
    app.get('/:uuid/usernamepassword', UsernamePasswordRoutes.get);
    app.post('/:uuid/usernamepassword', UsernamePasswordRoutes.post);
  }

  static get(req, res) {
    res.render('usernamepassword/index', { isFailedLogin: false, message: '' });
  }

  static post(req, res) {
    const user = Config.services.user.authenticate(req.body.username, req.body.password);

    if (user == null) {
      res.render('usernamepassword/index', { isFailedLogin: true, message: 'Login failed' });
      return;
    }

    InteractionComplete.process(req.params.uuid, { uid: user.id }, res);
  }
}

module.exports = UsernamePasswordRoutes;
