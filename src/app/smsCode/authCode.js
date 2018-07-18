'use strict';

const clients = require('./../../infrastructure/Clients');
const { upsertCode } = require('./../../infrastructure/UserCodes');

const validateRequest = async (req) => {
  if (!req.query.clientid) {
    return 'Must specify clientid param';
  } else if (!await clients.get(req.query.clientid)) {
    return `Invalid client id. Cannot find client with id ${req.query.clientid}`;
  }

  if (!req.query.uid) {
    return 'Must specify uid param';
  }

  return undefined;
};
const parseModel = (req) => {
  const model = {
    code: undefined,
    csrfToken: req.csrfToken(),
    validationMessages: {},
  };

  return model;
};
const sendCode = async (req) => {
  const uuid = req.params.uuid;
  const uid = req.query.uid;
  const clientId = req.query.clientid;

  await upsertCode(uid, clientId, 'na', req.id, 'SmsLogin');
};

const get = async (req, res) => {
  const validationResult = await validateRequest(req);
  if (validationResult) {
    return res.status(400).render('shared/badRequest', {
      errorMessage: validationResult,
    });
  }

  const model = parseModel(req);

  await sendCode(req);

  return res.render('smsCode/views/code', model);
};

const post = async (req, res) => {
  // const model = await validateRequest(req);
  const model = parseModel(req);
  return res.render('smsCode/views/code', model);
};

module.exports = {
  get,
  post,
};
