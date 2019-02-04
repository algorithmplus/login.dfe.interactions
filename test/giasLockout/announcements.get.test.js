jest.mock('./../../src/infrastructure/Config', () => {
  return () => ({
    hostingEnvironment: {
      giasApplicationId: 'gias-id',
    },
    access: {
      type: 'static',
    },
  });
});
jest.mock('./../../src/infrastructure/logger', () => ({
  warn: jest.fn(),
}));
jest.mock('./../../src/infrastructure/Organisations');
jest.mock('./../../src/infrastructure/access');
jest.mock('./../../src/app/InteractionComplete');

const { mockRequest, mockResponse } = require('./../utils');
const { getOrganisationById } = require('./../../src/infrastructure/Organisations');
const { getUsersAccessForServiceInOrganisation } = require('./../../src/infrastructure/access');
const InteractionComplete = require('./../../src/app/InteractionComplete');
const { get } = require('./../../src/app/giasLockout/announcements');

const res = mockResponse();

describe('When getting gias lock announcements', () => {
  let req;

  beforeEach(() => {
    getOrganisationById.mockReset().mockReturnValue({
      id: 'organisation-1',
      name: 'Organisation One',
      urn: 123456,
      ukprn: 369854,
    });

    getUsersAccessForServiceInOrganisation.mockReset().mockReturnValue({
      userId: 'user-1',
      serviceId: 'gias-id',
      organisationId: 'organisation-1',
      roles: [],
      identifiers: [],
      accessGrantedOn: '2018-08-03T06:51:21Z',
    });

    InteractionComplete.getPostbackDetails.mockReset().mockReturnValue({
      destination: 'https://oidc.test/complete',
      data: {
        uuid: 'interaction-1',
        uid: 'user-1',
        oid: 'organisation-1',
        sig: 'signed-data',
      },
    });
    InteractionComplete.process.mockReset();

    req = mockRequest({
      interaction: {
        uid: 'user-1',
        oid: 'organisation-1',
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

  it('then it should render the view if there are announcements', async () => {
    await get(req, res);

    expect(res.render).toHaveBeenCalledTimes(1);
    expect(res.render.mock.calls[0][0]).toBe('giasLockout/views/announcements');
  });

  it('then it should include organisation details for view', async () => {
    await get(req, res);

    expect(getOrganisationById).toHaveBeenCalledTimes(1);
    expect(getOrganisationById).toHaveBeenCalledWith('organisation-1', '123');
    expect(res.render.mock.calls[0][1]).toMatchObject({
      organisation: {
        id: 'organisation-1',
        name: 'Organisation One',
        identifiers: [
          { type: 'urn', value: 123456 },
          { type: 'ukprn', value: 369854 },
        ],
      },
    });
  });

  it('then it should include oidc postback details for view', async () => {
    await get(req, res);

    expect(InteractionComplete.getPostbackDetails).toHaveBeenCalledTimes(1);
    expect(InteractionComplete.getPostbackDetails).toHaveBeenCalledWith('interaction-1', {
      uuid: 'interaction-1',
      status: 'success',
      uid: 'user-1',
      oid: 'organisation-1',
      type: 'gias-lockout-check',
    });
    expect(res.render.mock.calls[0][1]).toMatchObject({
      postbackDetails: {
        destination: 'https://oidc.test/complete',
        data: {
          uuid: 'interaction-1',
          uid: 'user-1',
          oid: 'organisation-1',
          sig: 'signed-data',
        },
      },
    });
  });

  it('then it should include user having access to GIAS if they have GIAS for organisation', async () => {
    await get(req, res);

    expect(getUsersAccessForServiceInOrganisation).toHaveBeenCalledTimes(1);
    expect(getUsersAccessForServiceInOrganisation).toHaveBeenCalledWith('user-1', 'gias-id', 'organisation-1', '123');
    expect(res.render.mock.calls[0][1]).toMatchObject({
      hasAccessToGias: true,
    });
  });

  it('then it should include user not having access to GIAS if they do not have GIAS for organisation', async () => {
    getUsersAccessForServiceInOrganisation.mockReturnValue(undefined);

    await get(req, res);

    expect(getUsersAccessForServiceInOrganisation).toHaveBeenCalledTimes(1);
    expect(getUsersAccessForServiceInOrganisation).toHaveBeenCalledWith('user-1', 'gias-id', 'organisation-1', '123');
    expect(res.render.mock.calls[0][1]).toMatchObject({
      hasAccessToGias: false,
    });
  });


  it('then it should redirect to relying party if interaction has expired', async () => {
    req.interaction = undefined;

    await get(req, res);

    expect(res.redirect).toHaveBeenCalledTimes(1);
    expect(res.redirect).toHaveBeenCalledWith('https://relying.party.test/?error=sessionexpired');
  });

  it('then it should redirect to relying party if interaction has no oid', async () => {
    req.interaction.oid = undefined;

    await get(req, res);

    expect(res.redirect).toHaveBeenCalledTimes(1);
    expect(res.redirect).toHaveBeenCalledWith('https://relying.party.test/?error=sessionexpired');
  });

  it('then it should redirect to relying party if interaction has no uid', async () => {
    req.interaction.uid = undefined;

    await get(req, res);

    expect(res.redirect).toHaveBeenCalledTimes(1);
    expect(res.redirect).toHaveBeenCalledWith('https://relying.party.test/?error=sessionexpired');
  });

  it('then it should redirect to relying party if cannot find organisation', async () => {
    getOrganisationById.mockReturnValue(undefined);

    await get(req, res);

    expect(res.redirect).toHaveBeenCalledTimes(1);
    expect(res.redirect).toHaveBeenCalledWith('https://relying.party.test/?error=sessionexpired');
  });
});
