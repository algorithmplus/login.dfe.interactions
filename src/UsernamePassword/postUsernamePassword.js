const InteractionComplete = require('./../InteractionComplete');
const clients = require('./../Clients');
const Users = require('./../Users');

module.exports = async (req, res) => {
  const client = await clients.get(req.query.clientid);
  if (client == null) {
    InteractionComplete.process(req.params.uuid, { status: 'failed', reason: 'invalid clientid' }, res);
    return;
  }

  const user = await Users.authenticate(req.body.username, req.body.password, client);

  if (user == null) {
    res.render('usernamepassword/index', { isFailedLogin: true, message: 'Invalid email address or password. Try again.', csrfToken: req.csrfToken() });
    return;
  }
  InteractionComplete.process(req.params.uuid, { status: 'success', uid: user.id }, res);
};