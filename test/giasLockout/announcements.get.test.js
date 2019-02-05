jest.mock('./../../src/infrastructure/Config', () => {
  return () => ({
    hostingEnvironment: {
      giasApplicationId: 'gias-id',
    },
    access: {
      type: 'static',
    },
    applications: {
      type: 'static',
    },
  });
});
jest.mock('./../../src/infrastructure/logger', () => ({
  warn: jest.fn(),
}));
jest.mock('./../../src/infrastructure/Organisations');
jest.mock('./../../src/infrastructure/access');
jest.mock('./../../src/infrastructure/applications');
jest.mock('./../../src/app/InteractionComplete');

const { mockRequest, mockResponse } = require('./../utils');
const { getOrganisationById, getPageOfOrganisationAnnouncements } = require('./../../src/infrastructure/Organisations');
const { getUsersAccessForServiceInOrganisation } = require('./../../src/infrastructure/access');
const { getServiceById } = require('./../../src/infrastructure/applications');
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

    getPageOfOrganisationAnnouncements.mockReset().mockReturnValueOnce({
      announcements: [
        {
          id: 'announcement-1',
          originId: 'unit-test-1',
          organisationId: 'organisation-1',
          type: 1,
          title: 'Announcement One',
          summary: 'First announcement',
          body: 'unit test announcement one',
          publishedAt: '2019-01-31T14:49:00.000Z',
          expiresAt: '2020-01-31T14:49:00.000Z',
          published: true,
        },
      ],
      page: 1,
      numberOfPages: 2,
      totalNumberOfRecords: 2,
    }).mockReturnValueOnce({
      announcements: [
        {
          id: 'announcement-2',
          originId: 'unit-test-2',
          organisationId: 'organisation-1',
          type: 2,
          title: 'Announcement Two',
          summary: 'Second announcement',
          body: 'unit test announcement two',
          publishedAt: '2019-01-31T14:49:00.000Z',
          expiresAt: '2020-01-31T14:49:00.000Z',
          published: true,
        },
      ],
      page: 2,
      numberOfPages: 2,
      totalNumberOfRecords: 2,
    }).mockReturnValue({
      announcements: [],
      page: 3,
      numberOfPages: 2,
      totalNumberOfRecords: 2,
    });

    getUsersAccessForServiceInOrganisation.mockReset().mockReturnValue({
      userId: 'user-1',
      serviceId: 'gias-id',
      organisationId: 'organisation-1',
      roles: [],
      identifiers: [],
      accessGrantedOn: '2018-08-03T06:51:21Z',
    });

    getServiceById.mockReset().mockReturnValue({
      relyingParty: {
        service_home: 'https://gias.test',
      },
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

  it('then it should include all pages of announcements for view', async () => {
    await get(req, res);

    expect(getPageOfOrganisationAnnouncements).toHaveBeenCalledTimes(2);
    expect(getPageOfOrganisationAnnouncements).toHaveBeenCalledWith('organisation-1', 1, '123');
    expect(getPageOfOrganisationAnnouncements).toHaveBeenCalledWith('organisation-1', 2, '123');
    expect(res.render.mock.calls[0][1]).toMatchObject({
      announcements: [
        {
          title: 'Announcement One',
          message: 'unit test announcement one',
          level: 1,
        },
        {
          title: 'Announcement Two',
          message: 'unit test announcement two',
          level: 2,
        },
      ],
    });
  });

  it('then it should include gias service home url for view if user has access to GIAS', async () => {
    await get(req, res);

    expect(getServiceById).toHaveBeenCalledTimes(1);
    expect(getServiceById).toHaveBeenCalledWith('gias-id', '123');
    expect(res.render.mock.calls[0][1]).toMatchObject({
      giasServiceHome: 'https://gias.test',
    });
  });

  it('then it should not include gias service home url for view if user does not have access to gias', async () => {
    getUsersAccessForServiceInOrganisation.mockReturnValue(undefined);

    await get(req, res);

    expect(getServiceById).toHaveBeenCalledTimes(0);
    expect(res.render.mock.calls[0][1]).toMatchObject({
      giasServiceHome: undefined,
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
