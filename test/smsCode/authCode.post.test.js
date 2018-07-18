jest.mock('./../../src/app/InteractionComplete');
jest.mock('./../../src/infrastructure/Clients', () => ({
  get: jest.fn(),
}));
jest.mock('./../../src/infrastructure/UserCodes', () => ({
  upsertCode: jest.fn(),
  validateCode: jest.fn(),
  deleteCode: jest.fn(),
}));
jest.mock('./../../src/infrastructure/cache', () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}));

const { mockRequest, mockResponse } = require('./../utils');
const clients = require('./../../src/infrastructure/Clients');
const cache = require('./../../src/infrastructure/cache');
const { upsertCode, validateCode, deleteCode } = require('./../../src/infrastructure/UserCodes');
const InteractionComplete = require('./../../src/app/InteractionComplete');
const { post } = require('./../../src/app/smsCode/authCode');

const res = mockResponse();

describe('when validating user sms code', () => {
  let req;

  beforeEach(() => {
    clients.get.mockReset().mockImplementation((clientId) => {
      if (clientId === 'client1') {
        return {};
      }
      return null;
    });

    cache.set.mockReset();

    upsertCode.mockReset();
    validateCode.mockReset().mockReturnValue({ userCode: {} });
    deleteCode.mockReset();

    InteractionComplete.process.mockReset();

    req = mockRequest({
      method: 'POST',
      params: {
        uuid: 'interaction-id',
      },
      query: {
        clientid: 'client1',
        uid: 'user1',
      },
      body: {
        code: '123456',
      },
    });

    res.mockResetAll();
  });

  it('then it should complete the interaction successfully', async () => {
    await post(req, res);

    expect(InteractionComplete.process).toHaveBeenCalledTimes(1);
    expect(InteractionComplete.process.mock.calls[0][0]).toBe('interaction-id');
    expect(InteractionComplete.process.mock.calls[0][1]).toMatchObject({
      status: 'success',
      uid: 'user1',
      type: 'sms',
    });
    expect(InteractionComplete.process.mock.calls[0][2]).toBe(req);
    expect(InteractionComplete.process.mock.calls[0][3]).toBe(res);
  });

  it('then it should delete code', async () => {
    await post(req, res);

    expect(deleteCode).toHaveBeenCalledTimes(1);
    expect(deleteCode).toHaveBeenCalledWith('user1', '123', 'SmsLogin');
  });

  it('then it should send bad request if uid not specified', async () => {
    req.query.uid = undefined;

    await post(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.render).toHaveBeenCalledTimes(1);
    expect(res.render.mock.calls[0][0]).toBe('shared/badRequest');
    expect(res.render.mock.calls[0][1]).toEqual({
      errorMessage: 'Must specify uid param',
    });
  });

  it('then it should send bad request if clientid not specified', async () => {
    req.query.clientid = undefined;

    await post(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.render).toHaveBeenCalledTimes(1);
    expect(res.render.mock.calls[0][0]).toBe('shared/badRequest');
    expect(res.render.mock.calls[0][1]).toEqual({
      errorMessage: 'Must specify clientid param',
    });
  });

  it('then it should send bad request if clientid not valid', async () => {
    req.query.clientid = 'client2';

    await post(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.render).toHaveBeenCalledTimes(1);
    expect(res.render.mock.calls[0][0]).toBe('shared/badRequest');
    expect(res.render.mock.calls[0][1]).toEqual({
      errorMessage: 'Invalid client id. Cannot find client with id client2',
    });
  });

  it('then it should render view with error if code not entered', async () => {
    req.body.code = undefined;

    await post(req, res);

    expect(res.render).toHaveBeenCalledTimes(1);
    expect(res.render.mock.calls[0][0]).toBe('smsCode/views/code');
    expect(res.render.mock.calls[0][1]).toMatchObject({
      validationMessages: {
        code: 'Please enter a text message code',
      },
    });
  });

  it('then it should render view with error if code too short', async () => {
    req.body.code = '12345';

    await post(req, res);

    expect(res.render).toHaveBeenCalledTimes(1);
    expect(res.render.mock.calls[0][0]).toBe('smsCode/views/code');
    expect(res.render.mock.calls[0][1]).toMatchObject({
      validationMessages: {
        code: 'Please enter a valid text message code',
      },
    });
  });

  it('then it should render view with error if code too long', async () => {
    req.body.code = '1234567';

    await post(req, res);

    expect(res.render).toHaveBeenCalledTimes(1);
    expect(res.render.mock.calls[0][0]).toBe('smsCode/views/code');
    expect(res.render.mock.calls[0][1]).toMatchObject({
      validationMessages: {
        code: 'Please enter a valid text message code',
      },
    });
  });

  it('then it should render view with error if code not numeric', async () => {
    req.body.code = 'abcdef';

    await post(req, res);

    expect(res.render).toHaveBeenCalledTimes(1);
    expect(res.render.mock.calls[0][0]).toBe('smsCode/views/code');
    expect(res.render.mock.calls[0][1]).toMatchObject({
      validationMessages: {
        code: 'Please enter a valid text message code',
      },
    });
  });

  it('then it should render view with error if code not valid', async () => {
    validateCode.mockReturnValue(undefined);

    await post(req, res);

    expect(res.render).toHaveBeenCalledTimes(1);
    expect(res.render.mock.calls[0][0]).toBe('smsCode/views/code');
    expect(res.render.mock.calls[0][1]).toMatchObject({
      validationMessages: {
        code: 'Please enter a valid text message code',
      },
    });
  });

  it('then it should valid code with api for user', async () => {
    await post(req, res);

    expect(validateCode).toHaveBeenCalledTimes(1);
    expect(validateCode).toHaveBeenCalledWith('user1', '123456', '123', 'SmsLogin');
  });

  it('and resend true, then it should upsert code (even if cached)', async () => {
    cache.set.mockReturnValue(true);
    req.body.resend = true;

    await post(req, res);

    expect(upsertCode).toHaveBeenCalledTimes(1);
    expect(upsertCode).toHaveBeenCalledWith('user1', 'client1', 'na', '123', 'SmsLogin');
  });

  it('and resend true, then it should render view with errors cleared', async () => {
    req.body.resend = true;

    await post(req, res);

    expect(res.render).toHaveBeenCalledTimes(1);
    expect(res.render.mock.calls[0][0]).toBe('smsCode/views/code');
    expect(res.render.mock.calls[0][1].validationMessages).toBeDefined();
    expect(Object.keys(res.render.mock.calls[0][1].validationMessages)).toHaveLength(0);
  });
});
