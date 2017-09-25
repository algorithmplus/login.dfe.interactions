const Config = require('./../Config');
const InteractionComplete = require('./../InteractionComplete');

class UsernamePasswordRoutes {
  static register(app, csrf) {
    app.get('/:uuid/usernamepassword', csrf, UsernamePasswordRoutes.get);
    app.post('/:uuid/usernamepassword', csrf, UsernamePasswordRoutes.post);
  }

  static get(req, res) {
    res.render('usernamepassword/index', { isFailedLogin: false, message: '', csrfToken: req.csrfToken() });
  }

  static post(req, res) {
    const user = Config.services.user.authenticate(req.body.username, req.body.password);

    if (user == null) {
      res.render('usernamepassword/index', { isFailedLogin: true, message: 'Login failed', csrfToken: req.csrfToken() });
      return;
    }

    InteractionComplete.process(req.params.uuid, { uid: user.id }, res);
  }
}

module.exports = UsernamePasswordRoutes;
