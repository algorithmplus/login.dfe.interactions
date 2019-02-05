const config = require('./../../infrastructure/Config')();
const logger = require('./../../infrastructure/logger');
const { getOrganisationById, getPageOfOrganisationAnnouncements } = require('./../../infrastructure/Organisations');
const { getUsersAccessForServiceInOrganisation } = require('./../../infrastructure/access');
const { getServiceById } = require('./../../infrastructure/applications');
const InteractionComplete = require('./../InteractionComplete');

const getOrganisationDetails = async (oid, correlationId) => {
  const organisation = await getOrganisationById(oid, correlationId);
  if (!organisation) {
    return undefined;
  }

  return {
    id: organisation.id,
    name: organisation.name,
    identifiers: [
      { type: 'urn', value: organisation.urn || undefined },
      { type: 'uid', value: organisation.uid || undefined },
      { type: 'ukprn', value: organisation.ukprn || undefined },
    ].filter(x => x.value !== undefined),
  };
};

const getOrganisationAnnouncements = async (oid, correlationId) => {
  const announcements = [];
  let pageNumber = 1;
  let numberOfPages;
  while (numberOfPages === undefined || pageNumber <= numberOfPages) {
    const page = await getPageOfOrganisationAnnouncements(oid, pageNumber, correlationId);

    if (page.announcements) {
      announcements.push(...page.announcements.map(a => ({
        title: a.title,
        message: a.body,
        level: a.type === 1 || a.type === 4 ? 1 : 2,
        type: a.type,
      })));
    }

    pageNumber += 1;
    numberOfPages = page.numberOfPages;
  }
  return announcements;
};

const checkIfUserHasAccessToGias = async (uid, oid, correlationId) => {
  const giasAccess = await getUsersAccessForServiceInOrganisation(uid, config.hostingEnvironment.giasApplicationId, oid, correlationId);
  return giasAccess ? true : false;
};

const getGiasServiceHome = async (correlationId) => {
  const application = await getServiceById(config.hostingEnvironment.giasApplicationId, correlationId);
  return application.relyingParty.service_home;
};

const get = async (req, res) => {
  const correlationId = req.id;
  if (!req.interaction) {
    logger.warn(`Request to GIAS lockout with expired session (uuid: ${req.params.uuid})`, { correlationId });
    return res.redirect(`${req.query.redirect_uri}?error=sessionexpired`);
  }
  if (!req.interaction.uid || !req.interaction.oid) {
    logger.warn(`Request to GIAS lockout missing oid and/or uid (uuid: ${req.params.uuid}, oid: ${req.interaction.oid}, uid: ${req.interaction.uid})`, { correlationId });
    return res.redirect(`${req.query.redirect_uri}?error=sessionexpired`);
  }

  const interactionCompleteData = {
    uuid: req.params.uuid,
    status: 'success',
    uid: req.interaction.uid,
    oid: req.interaction.oid,
    type: 'gias-lockout-check',
  };

  const announcements = await getOrganisationAnnouncements(req.interaction.oid, correlationId);
  if (announcements.length === 0) {
    return InteractionComplete.process(req.params.uuid, interactionCompleteData,
      req, res);
  }

  const organisation = await getOrganisationDetails(req.interaction.oid, correlationId);
  if (!organisation) {
    logger.warn(`Failed to find organisation for GIAS lockout (uuid: ${req.params.uuid}, oid: ${req.interaction.oid})`, { correlationId });
    return res.redirect(`${req.query.redirect_uri}?error=sessionexpired`);
  }

  const canContinue = announcements.filter(a => a.level === 2).length === 0;
  const postbackDetails = InteractionComplete.getPostbackDetails(req.params.uuid, interactionCompleteData);
  const hasAccessToGias = await checkIfUserHasAccessToGias(req.interaction.uid, req.interaction.oid, correlationId);
  const giasServiceHome = hasAccessToGias ? await getGiasServiceHome(correlationId) : undefined;

  const model = {
    organisation,
    announcements,
    hasAccessToGias,
    canContinue,
    postbackDetails,
    giasServiceHome,
  };
  return res.render('giasLockout/views/announcements', model);
};
module.exports = {
  get,
};
