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
const { associatedWithUser: getUserOrganisations } = require('./../../src/infrastructure/Organisations');

const res = mockResponse();
const orgData= [
  {
    organisation: {
      id: 'org-1',
      name: 'Organisation One',
    },
  },
  {
    organisation: {
      id: 'org-2',
      name: 'Organisation Two',
    },
  },
];

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

    getUserOrganisations.mockReset().mockReturnValue(orgData)

    res.mockResetAll();
  });



  it('then it should redirect back to relying party if interaction has expired', async () => {
    req.interaction = undefined;

    await post(req, res);

    expect(res.redirect).toHaveBeenCalledTimes(1);
    expect(res.redirect).toHaveBeenCalledWith('https://relying.party.test/?error=sessionexpired');
  });
});
