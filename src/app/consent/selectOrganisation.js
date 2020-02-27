'use strict';

const logger = require('./../../infrastructure/logger');
const organisationApi = require('./../../infrastructure/Organisations');
const InteractionComplete = require('./../InteractionComplete');

const getNaturalIdentifiers = (orgsForUser) => {
  for (let i = 0; i < orgsForUser.length; i++) {
    const org = orgsForUser[i];
    if (org.organisation) {
      org.naturalIdentifiers = [];
      const urn = org.organisation.urn;
      const uidOrg = org.organisation.uid;
      const ukprn = org.organisation.ukprn;
      if (urn) {
        org.naturalIdentifiers.push(`URN: ${urn}`);
      }
      if (uidOrg) {
        org.naturalIdentifiers.push(`UID: ${uidOrg}`);
      }
      if (ukprn) {
        org.naturalIdentifiers.push(`UKPRN: ${ukprn}`);
      }
    }
  }
};

const getOrganisation = async (req, res) => {
  const correlationId = req.id;
  if (!req.interaction) {
    logger.warn(`Request to consent lockout with expired session (uuid: ${req.params.uuid})`, { correlationId });
    return res.redirect(`${req.query.redirect_uri}?error=sessionexpired`);
  }
  const uid = req.interaction.uid;
  if (!uid) {
    return InteractionComplete.process(req.params.uuid, { status: 'failed', uid: req.query.uid, type: 'consent', reason: 'Missing uid'}, req, res);
  }

  if (!req.interaction.scopes.includes('organisation') && !req.interaction.scopes.includes('organisationid') ) {
    return res.redirect(`/${req.params.uuid}/consent?role_scope=${req.query.role_scope}`);
  }

  const orgsForUser = await organisationApi.associatedWithUserV2(uid);

  if (!orgsForUser || orgsForUser.length === 0) {
    return res.redirect(`/${req.params.uuid}/consent`);
  }

  if (orgsForUser.length === 1) {
    return res.redirect(`/${req.params.uuid}/consent?oid=${orgsForUser[0].organisation.id}&role_scope=${req.query.role_scope}`);
  }
  getNaturalIdentifiers(orgsForUser);

  return res.render('consent/views/select-organisation', {
    orgsForUser,
    csrfToken: req.csrfToken(),
    code: '',
    validationMessages: {},
  });
};

const postOrganisation = async (req, res) => {
  const correlationId = req.id;
  if (!req.interaction) {
    logger.warn(`Request to consent lockout with expired session (uuid: ${req.params.uuid})`, { correlationId });
    return res.redirect(`${req.query.redirect_uri}?error=sessionexpired`);
  }
  const uid = req.interaction.uid;
  if (!req.body['selected-organisation']) {
    const orgsForUser = await organisationApi.associatedWithUser(uid);
    getNaturalIdentifiers(orgsForUser);
    return res.render('consent/views/select-organisation', {
      orgsForUser,
      csrfToken: req.csrfToken(),
      code: '',
      validationMessages: {
        organisation: 'Please select an organisation',
      },
    });
  }
  const organisation = req.body['selected-organisation'];

  return res.redirect(`/${req.params.uuid}/consent?oid=${organisation}&role_scope=${req.query.role_scope}`);

  // return InteractionComplete.process(req.params.uuid, { status: 'success', uid: req.query.uid, type: 'select-organisation', organisation }, req, res);
};

module.exports = { getOrganisation, postOrganisation };
