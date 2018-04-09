jest.mock('login.dfe.audit.winston-sequelize-transport');
jest.mock('./../../src/infrastructure/logger', () => {
  return {  };
});
jest.mock('./../../src/infrastructure/Config', () => {
  return jest.fn().mockImplementation(() => {
    return {
      hostingEnvironment: {
        agentKeepAlive: {},
      },
    };
  });
});
const utils = require('./../utils');

describe('When user is shown username/password', () => {
  let req;
  let res;
  let clientsGet;
  let loggerAudit;

  let getHandler;

  beforeEach(() => {
    req = utils.mockRequest();
    req.query.clientid = 'test';
    req.params.uuid = 'some-uuid';
    req.csrfToken.mockReturnValue('my-secure-token');

    res = utils.mockResponse();

    clientsGet = jest.fn().mockReturnValue({
      client_id: 'test',
      params: {
        header: 'Custom header message',
        headerMessage: 'New message',
        supportsUsernameLogin: true,
      },
    });
    const clients = require('./../../src/infrastructure/Clients');
    clients.get = clientsGet;

    loggerAudit = jest.fn();
    const logger = require('./../../src/infrastructure/logger');
    logger.audit = loggerAudit;
    logger.info = jest.fn();

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
        headerMessage: 'New message',
        supportsUsernameLogin: true,
      });
    });
  });

  describe('with an invalid client id', () => {
    beforeEach(() => {
      clientsGet.mockReturnValue(null);
    });

    it('then an error is thrown', async () => {
      let error = null;
      try {
        await getHandler(req, res);
      } catch (e) {
        error = e;
      }

      expect(error).not.toBeNull();
    });
  });
});
