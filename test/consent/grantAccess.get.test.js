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

const { mockRequest, mockResponse } = require('./../utils');
const { getServiceById } = require('./../../src/infrastructure/applications');
const { find: getUserById } = require('./../../src/infrastructure/Users');
const { associatedWithUser: getUserOrganisations } = require('./../../src/infrastructure/Organisations');
const { get } = require('./../../src/app/consent/grantAccess');

const res = mockResponse();

describe('when prompting user to grant application access', () => {
  let req;

  beforeEach(() => {
    getServiceById.mockReset().mockReturnValue({
      name: 'Application One',
    });

    getUserById.mockReset().mockReturnValue({
      sub: 'user-1',
      given_name: 'User',
      family_name: 'One',
      email: 'user.one@unit.tests',
    });

    getUserOrganisations.mockReset().mockReturnValue([
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
    ])

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
    });

    res.mockResetAll();
  });

  it('then it should render grant access view', async () => {
    await get(req, res);

    expect(res.render).toHaveBeenCalledTimes(1);
    expect(res.render.mock.calls[0][0]).toBe('consent/views/grantAccess');
  });

  it('then it should include application details in model', async () => {
    await get(req, res);

    expect(getServiceById).toHaveBeenCalledTimes(1);
    expect(getServiceById).toHaveBeenCalledWith('client-1', req.id);
    expect(res.render).toHaveBeenCalledTimes(1);
    expect(res.render.mock.calls[0][1]).toMatchObject({
      application: {
        name: 'Application One',
      },
    });
  });

  it('then it should include user details in model', async () => {
    await get(req, res);

    expect(getUserById).toHaveBeenCalledTimes(1);
    expect(getUserById).toHaveBeenCalledWith('user-1', req.id);
    expect(res.render).toHaveBeenCalledTimes(1);
    expect(res.render.mock.calls[0][1].user).toMatchObject({
      sub: 'user-1',
      given_name: 'User',
      family_name: 'One',
      email: 'user.one@unit.tests',
    });
  });

  it('then it should include user organisation details in model if scopes includes organisation', async () => {
    await get(req, res);

    expect(getUserOrganisations).toHaveBeenCalledTimes(1);
    expect(getUserOrganisations).toHaveBeenCalledWith('user-1', req.id);
    expect(res.render).toHaveBeenCalledTimes(1);
    expect(res.render.mock.calls[0][1].user.organisations).toEqual([
      {
        id: 'org-1',
        name: 'Organisation One',
      },
      {
        id: 'org-2',
        name: 'Organisation Two',
      },
    ]);
  });

  it('then it should not include user organisation details in model if scopes includes organisation', async () => {
    req.interaction.scopes = ['openid', 'profile', 'email'];

    await get(req, res);

    expect(getUserOrganisations).toHaveBeenCalledTimes(0);
    expect(res.render).toHaveBeenCalledTimes(1);
    expect(res.render.mock.calls[0][1].user.organisations).toEqual([]);
  });

  it('then it should include scopes in model', async () => {
    await get(req, res);

    expect(res.render).toHaveBeenCalledTimes(1);
    expect(res.render.mock.calls[0][1]).toMatchObject({
      scopes: ['openid', 'profile', 'email', 'organisation'],
    });
  });

  it('then it should include redirect uri in model', async () => {
    await get(req, res);

    expect(res.render).toHaveBeenCalledTimes(1);
    expect(res.render.mock.calls[0][1]).toMatchObject({
      redirectUri: 'https://relying.party.test/auth',
    });
  });

  it('then it should redirect back to relying party if interaction has expired', async () => {
    req.interaction = undefined;

    await get(req, res);

    expect(res.redirect).toHaveBeenCalledTimes(1);
    expect(res.redirect).toHaveBeenCalledWith('https://relying.party.test/?error=sessionexpired');
  });
});
