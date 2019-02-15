jest.mock('./../../src/infrastructure/Config', () => {
  return () => ({
    applications: {
      type: 'static',
    },
    directories: {
      type: 'static',
    },
  });
});
jest.mock('./../../src/infrastructure/logger', () => ({
  warn: jest.fn(),
}));
jest.mock('./../../src/infrastructure/applications');
jest.mock('./../../src/infrastructure/Users');
jest.mock('./../../src/infrastructure/Organisations');
jest.mock('./../../src/app/InteractionComplete');

const { mockRequest, mockResponse } = require('./../utils');
const InteractionComplete = require('./../../src/app/InteractionComplete');
const { post } = require('./../../src/app/consent/grantAccess');

const res = mockResponse();

describe('when handling user granting application access', () => {
  let req;

  beforeEach(() => {
    req = mockRequest({
      interaction: {
        client_id: 'client-1',
        redirect_uri: 'https://relying.party.test/auth',
        uid: 'user-1',
        scopes: ['openid', 'profile', 'email', 'organisation'],
      },
      params: {
        uuid: 'interaction-1',
      },
      query: {
        redirect_uri: 'https://relying.party.test/',
      },
      body: {
        organisation: ['org-1', 'org-2'],
      },
    });

    res.mockResetAll();
  });

  it('then it should complete interaction with selected organisations', async () => {
    await post(req, res);

    expect(InteractionComplete.process).toHaveBeenCalledTimes(1);
    expect(InteractionComplete.process).toHaveBeenCalledWith('interaction-1', {
      uuid: 'interaction-1',
      uid: 'user-1',
      status: 'success',
      type: 'consent',
      organisations: 'org-1|org-2',
    }, req, res);
  });

  it('then it should complete interaction with selected organisation when organisation array', async () => {
    req.body.organisation = ['org-1'];

    await post(req, res);

    expect(InteractionComplete.process).toHaveBeenCalledTimes(1);
    expect(InteractionComplete.process).toHaveBeenCalledWith('interaction-1', {
      uuid: 'interaction-1',
      uid: 'user-1',
      status: 'success',
      type: 'consent',
      organisations: 'org-1',
    }, req, res);
  });

  it('then it should complete interaction with selected organisation when organisation string', async () => {
    req.body.organisation = 'org-1';

    await post(req, res);

    expect(InteractionComplete.process).toHaveBeenCalledTimes(1);
    expect(InteractionComplete.process).toHaveBeenCalledWith('interaction-1', {
      uuid: 'interaction-1',
      uid: 'user-1',
      status: 'success',
      type: 'consent',
      organisations: 'org-1',
    }, req, res);
  });

  it('then it should redirect back to relying party if interaction has expired', async () => {
    req.interaction = undefined;

    await post(req, res);

    expect(res.redirect).toHaveBeenCalledTimes(1);
    expect(res.redirect).toHaveBeenCalledWith('https://relying.party.test/?error=sessionexpired');
  });
});
