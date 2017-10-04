const InteractionComplete = require('./../InteractionComplete');
const clients = require('./../Clients');
const Users = require('./../Users');

module.exports = async (req, res) => {
  const client = await clients.get(req.query.clientid);

  const user = await Users.authenticate(req.body.username, req.body.password, client);
  
  if (user == null) {
    res.render('usernamepassword/index', { isFailedLogin: true, message: 'Invalid email address or password. Try again.', csrfToken: req.csrfToken() });
    return;
  }
  InteractionComplete.process(req.params.uuid, { uid: user.id }, res);
};