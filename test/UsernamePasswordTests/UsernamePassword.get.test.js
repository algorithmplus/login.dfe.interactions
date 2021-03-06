jest.mock('login.dfe.audit.winston-sequelize-transport');
jest.mock('./../../src/infrastructure/logger', () => ({}));
jest.mock('./../../src/infrastructure/Config', () => jest.fn().mockImplementation(() => ({
  hostingEnvironment: {
  },
  applications: {
    type: 'static',
  },
})));


jest.mock('./../../src/infrastructure/oidc', () => ({
  getInteractionById: jest.fn(),
}));
const utils = require('./../utils');

describe('When user is shown username/password', () => {
  let req;
  let res;
  let clientsGet;
  let bannerGet;
  let getInteractionById;
  let loggerAudit;

  let getHandler;

  beforeEach(() => {
    req = utils.mockRequest();
    req.query.clientid = 'test';
    req.query.redirect_uri = 'http://test';
    req.params.uuid = 'some-uuid';
    req.csrfToken.mockReturnValue('my-secure-token');

    res = utils.mockResponse();

    clientsGet = jest.fn().mockReturnValue({
      relyingParty: {
        client_id: 'test',
        params: {
          header: 'Custom header message',
          headerMessage: 'New message',
          supportsUsernameLogin: true,
        },
      },
    });

    bannerGet = jest.fn().mockReturnValue([{
      id: 'bannerId',
      serviceId: 'serviceId',
      name: 'banner name',
      title: 'Custom header message',
      message: 'New message',
      isActive: true,
    }]);
    const applications = require('./../../src/infrastructure/applications');
    applications.getServiceById = clientsGet;
    applications.listAllBannersForService = bannerGet;

    loggerAudit = jest.fn();
    const logger = require('./../../src/infrastructure/logger');
    logger.audit = loggerAudit;
    logger.info = jest.fn();

    getInteractionById = require('./../../src/infrastructure/oidc').getInteractionById;
    getInteractionById.mockReset().mockReturnValue({
      client_id: 'test',
      redirect_uri: 'http://test',
    });

    getHandler = require('./../../src/app/UsernamePassword/getUsernamePassword');
  });

  describe('then the view is loaded', () => {
    it('as the index page', async () => {
      await getHandler(req, res);

      expect(res.render.mock.calls[0][0]).toBe('UsernamePassword/views/index');
    });
  });

  describe('then the client details are retrieved from the API and added to the view', () => {
    it('then the client message is shown', async () => {
      await getHandler(req, res);

      expect(clientsGet.mock.calls).toHaveLength(1);
      expect(res.render.mock.calls[0][1]).toMatchObject({
        header: 'Custom header message',
        headerMessage: '<p>New message</p>',
        supportsUsernameLogin: true,
      });
    });
  });

  describe('with an invalid client id', () => {
    beforeEach(() => {
      clientsGet.mockReturnValue(null);
    });

    // it('then an error is thrown', async () => {
    //   let error = null;
    //   try {
    //     await getHandler(req, res);
    //   } catch (e) {
    //     error = e;
    //   }

    //   expect(error).not.toBeNull();
    // });
  });

  describe('with an invalid interation id', () => {
    beforeEach(() => {
      getInteractionById.mockReturnValue(undefined);
    });

    it('then it should redirect to origin with error', async () => {
      await getHandler(req, res);

      expect(res.redirect.mock.calls).toHaveLength(1);
      expect(res.redirect.mock.calls[0][0]).toBe('http://test?error=sessionexpired');
    });
  });
});
