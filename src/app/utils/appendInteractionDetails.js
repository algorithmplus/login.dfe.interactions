const { getInteractionById } = require('./../../infrastructure/oidc');

const appendInteractionDetails = async (req, res, next) => {
  const interationId = req.params.uuid;
  const interaction = await getInteractionById(interationId);
  if (!interaction) {
    return res.redirect(`${req.query.redirect_uri}?error=sessionexpired`);
  }

  req.interaction = interaction;

  next();
};
module.exports = appendInteractionDetails;
