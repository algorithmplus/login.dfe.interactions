const Config = require('./../Config');
const InteractionComplete = require('./../InteractionComplete')

module.exports = (req, res) => {
  const user = Config.services.user.authenticate(req.body.username, req.body.password);
  if (user == null) {
    res.render('usernamepassword/index', { isFailedLogin: true, message: 'Invalid email address or password. Try again.', csrfToken: req.csrfToken() });
    return;
  }
  InteractionComplete.process(req.params.uuid, { uid: user.id }, res);
};