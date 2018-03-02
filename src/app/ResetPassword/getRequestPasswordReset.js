'use strict';

const hotConfig = require('./../../infrastructure/Clients');
const config = require('./../../infrastructure/Config')();
const { ejsErrorPages } = require('login.dfe.express-error-handling');

const action = async (req, res) => {
  const client = await hotConfig.get(req.query.clientid, req.id);

  let isValidRedirect = false;

  if (client) {
    const validUriResult = client.redirect_uris.find(c => c === req.query.redirect_uri);
    if (validUriResult) {
      isValidRedirect = true;
    }
  }

  if (!isValidRedirect) {
    let details = `Invalid redirect_uri (clientid: ${req.query.clientid}, redirect_uri: ${req.query.redirect_uri}) - `;
    if(!client) {
      details += 'no client by that id';
    } else {
      details += 'redirect_uri not in list of specified redirect_uris';
    }
    throw new Error(details);
  } else {
    res.render('ResetPassword/views/request', {
      csrfToken: req.csrfToken(),
      title: 'Forgotten your password?',
      email: '',
      uuid: req.params.uuid,
      clientId: req.query.clientid,
      redirectUri: req.query.redirect_uri,
      validationMessages: {},
      validationFailed: false,
    });
  }
};

module.exports = action;
