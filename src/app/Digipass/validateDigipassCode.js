const { getDevices } = require('./../../infrastructure/Users');
const { validateDigipassToken } = require('./../../infrastructure/devices');
const logger = require('./../../infrastructure/logger');
const InteractionComplete = require('./../InteractionComplete');

const validateInput = (code) => {
  const messages = {
    code: undefined,
  };
  let valid = true;

  if (!code) {
    messages.code = 'You must enter your code';
    valid = false;
  } else if (code.length !== 8 || isNaN(parseInt(code))) {
    messages.code = 'Your code must be 8 digits';
    valid = false;
  }

  return {
    valid,
    messages,
  };
};

const validateToken = async (uid, code) => {
  const devices = await getDevices(uid);
  if (!devices || devices.length === 0) {
    logger.info(`No devices for ${uid}`);
    return false;
  }

  const digipass = devices.find(d => d.type === 'digipass');
  if (!digipass) {
    logger.info(`No digipass devices for ${uid}`);
    return false;
  }

  return await validateDigipassToken(digipass.serialNumber, code);
};

const action = async (req, res) => {
  const validationResult = validateInput(req.body.code);
  if (!validationResult.valid) {
    return res.render('Digipass/views/token', {
      csrfToken: req.csrfToken(),
      code: '',
      validationMessages: validationResult.messages,
    });
  }

  const codeValid = await validateToken(req.query.uid, req.body.code);
  if (!codeValid) {
    return res.render('Digipass/views/token', {
      csrfToken: req.csrfToken(),
      code: '',
      validationMessages: {
        code: 'The code you entered is invalid',
      },
    });
  }

  return InteractionComplete.process(req.params.uuid, { status: 'success' }, res);
};

module.exports = action;
