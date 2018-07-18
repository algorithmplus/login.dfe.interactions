jest.mock('./../../src/infrastructure/Clients', () => ({
  get: jest.fn(),
}));
jest.mock('./../../src/infrastructure/UserCodes', () => ({
  upsertCode: jest.fn(),
}));

const { mockRequest, mockResponse } = require('./../utils');
const clients = require('./../../src/infrastructure/Clients');
const { upsertCode } = require('./../../src/infrastructure/UserCodes');
const { get } = require('./../../src/app/smsCode/authCode');

const res = mockResponse();

describe('when prompting user for sms code', () => {
  let req;

  beforeEach(() => {
    clients.get.mockReset().mockImplementation((clientId) => {
      if (clientId === 'client1') {
        return {};
      }
      return null;
    });

    upsertCode.mockReset();

    req = mockRequest({
      query: {
        clientid: 'client1',
        uid: 'user1',
      },
    });

    res.mockResetAll();
  });

  it('then it should render code view', async () => {
    await get(req, res);

    expect(res.render).toHaveBeenCalledTimes(1);
    expect(res.render.mock.calls[0][0]).toBe('smsCode/views/code');
  });

  it('then it should send bad request if uid not specified', async () => {
    req.query.uid = undefined;

    await get(req, res);

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

    await get(req, res);

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

    await get(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.render).toHaveBeenCalledTimes(1);
    expect(res.render.mock.calls[0][0]).toBe('shared/badRequest');
    expect(res.render.mock.calls[0][1]).toEqual({
      errorMessage: 'Invalid client id. Cannot find client with id client2',
    });
  });

  it('then it should send code to user', async () => {
    await get(req, res);

    expect(upsertCode).toHaveBeenCalledTimes(1);
    expect(upsertCode).toHaveBeenCalledWith('user1', 'client1', 'na', '123', 'SmsLogin');
  });
});
