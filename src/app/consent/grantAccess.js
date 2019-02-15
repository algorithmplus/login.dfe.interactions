const logger = require('./../../infrastructure/logger');
const { getServiceById } = require('./../../infrastructure/applications');
const { find: getUserById } = require('./../../infrastructure/Users');
const { associatedWithUser: getUserOrganisations } = require('./../../infrastructure/Organisations');
const InteractionComplete = require('./../InteractionComplete');

const get = async (req, res) => {
  const correlationId = req.id;
  if (!req.interaction) {
    logger.warn(`Request to GIAS lockout with expired session (uuid: ${req.params.uuid})`, { correlationId });
    return res.redirect(`${req.query.redirect_uri}?error=sessionexpired`);
  }

  const application = await getServiceById(req.interaction.client_id, req.id);
  const user = await getUserById(req.interaction.uid, req.id);

  if (req.interaction.scopes.find(x => x === 'organisation')) {
    const userOrganisations = await getUserOrganisations(req.interaction.uid, req.id);
    user.organisations = userOrganisations.map(x => x.organisation);
  } else {
    user.organisations = [];
  }

  return res.render('consent/views/grantAccess', {
    csrfToken: req.csrfToken(),
    hideUserNav: true,
    application,
    user,
    scopes: req.interaction.scopes,
    redirectUri: req.interaction.redirect_uri,
  });
};

const post = async (req, res) => {
  const correlationId = req.id;
  if (!req.interaction) {
    logger.warn(`Request to GIAS lockout with expired session (uuid: ${req.params.uuid})`, { correlationId });
    return res.redirect(`${req.query.redirect_uri}?error=sessionexpired`);
  }

  const organisations = req.body.organisation instanceof Array ? req.body.organisation : [req.body.organisation];
  const data = {
    uuid: req.params.uuid,
    uid: req.interaction.uid,
    status: 'success',
    type: 'consent',
    organisations: organisations.join('|'),
  };
  InteractionComplete.process(req.params.uuid, data, req, res);
};

module.exports = {
  get,
  post,
};
