'use strict';

const clients = require('./../../infrastructure/Clients');

const get = async (req, res) => {
  const clientId = req.query.clientid;

  const client = await clients.get(clientId);

  if (!client) {
    let details = `Invalid redirect_uri (clientid: ${req.query.clientid}, redirect_uri: ${req.query.redirect_uri}) - `;
    if (!client) {
      details += 'no client by that id';
    } else {
      details += 'redirect_uri not in list of specified redirect_uris';
    }
    throw new Error(details);
  }

  req.session.migrationUser = null;
  req.session.redirectUri = null;

  res.render('UsernamePassword/views/index', {
    isFailedLogin: false,
    message: '',
    title: 'DfE Sign-in',
    clientId,
    uuid: req.params.uuid,
    csrfToken: req.csrfToken(),
    redirectUri: req.query.redirect_uri,
    validationMessages: {},
    header: !client.params || client.params.header,
    headerMessage: !client.params || client.params.headerMessage,
    supportsUsernameLogin: !client.params || client.params.supportsUsernameLogin,
  });
};

module.exports = get;
