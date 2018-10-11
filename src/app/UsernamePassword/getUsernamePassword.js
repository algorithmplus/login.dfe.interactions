'use strict';

const applicationsApi = require('./../../infrastructure/applications');
const oidc = require('./../../infrastructure/oidc');

const get = async (req, res) => {
  const interactionDetails = await oidc.getInteractionById(req.params.uuid);
  if (!interactionDetails) {
    return res.redirect(`${req.query.redirect_uri}?error=sessionexpired`);
  }

  const clientId = req.query.clientid;
  const client = await applicationsApi.getServiceById(clientId, req.id);
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
    header: !client.relyingParty.params || client.relyingParty.params.header,
    headerMessage: !client.relyingParty.params || client.relyingParty.params.headerMessage,
    supportsUsernameLogin: !client.relyingParty.params || client.relyingParty.params.supportsUsernameLogin,
  });
};

module.exports = get;
