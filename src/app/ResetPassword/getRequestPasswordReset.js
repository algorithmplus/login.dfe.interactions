'use strict';

const hotConfig = require('./../../infrastructure/Clients');

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
    res.redirect('/error');
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
