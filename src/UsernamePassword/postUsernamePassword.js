const InteractionComplete = require('./../InteractionComplete');
const Users = require('./../Users')

module.exports = (req, res) => {
  const user = Users.authenticate(req.body.username, req.body.password);

  if (user == null) {
    res.render('usernamepassword/index', { isFailedLogin: true, message: 'Login failed', csrfToken: req.csrfToken() });
    return;
  }

  InteractionComplete.process(req.params.uuid, { uid: user.id }, res);
};