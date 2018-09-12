const utils = require('./../utils');
jest.mock('login.dfe.audit.winston-sequelize-transport');
jest.mock('./../../src/infrastructure/Clients');
jest.mock('./../../src/infrastructure/UserCodes');
jest.mock('./../../src/infrastructure/Users');
jest.mock('./../../src/infrastructure/logger', () => {
  return {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
});
jest.mock('./../../src/infrastructure/applications', () => ({
  getServiceById: jest.fn(),
}));

jest.mock('./../../src/infrastructure/Config', () => {
  return jest.fn().mockImplementation(() => {
    return {
      hostingEnvironment: {
        agentKeepAlive: {},
      },
      notifications: {
        connectionString: {},
      },
    };
  });
});
describe('when handling the posting of a password reset request', () => {

  let req;
  let res;
  let clientsGet;
  let userCodesUpsertCode;
  let usersFind;

  let postRequestPasswordReset;

  beforeEach(() => {
    req = utils.mockRequest();
    res = utils.mockResponse();

    clientsGet = jest.fn();
    const clients = require('./../../src/infrastructure/Clients');
    clients.get = clientsGet;

    userCodesUpsertCode = jest.fn();
    const userCodes = require('./../../src/infrastructure/UserCodes');
    userCodes.upsertCode = userCodesUpsertCode;

    usersFind = jest.fn().mockReturnValue({ sub: '12345' });
    const users = require('./../../src/infrastructure/Users');
    users.find = usersFind;

    postRequestPasswordReset = require('./../../src/app/ResetPassword/postRequestPasswordReset');
  });

  describe('and the details are valid', () => {
    beforeEach(() => {
      req.body = {
        email: 'user.one@unit.test',
        clientId: 'client1',
        redirectUri: 'https://local.test',
      };
    });

    it('then the user is retrieved from the directories api', async () => {
      await postRequestPasswordReset(req,res);

      expect(usersFind.mock.calls.length).toBe(1);
      expect(usersFind.mock.calls[0][0]).toBe('user.one@unit.test');
    });

    it('then a user code is requested for that user id', async ()=> {
      await postRequestPasswordReset(req,res);

      expect(userCodesUpsertCode.mock.calls.length).toBe(1);
      expect(userCodesUpsertCode.mock.calls[0][0]).toBe('12345');
      expect(userCodesUpsertCode.mock.calls[0][1]).toBe('client1');
      expect(userCodesUpsertCode.mock.calls[0][2]).toBe('https://local.test');
    });

    it('then it should render the confirm view', async () => {
      await postRequestPasswordReset(req,res);

      expect(res.redirect.mock.calls).toHaveLength(1);
      expect(res.redirect.mock.calls[0][0]).toBe('/123-abc/resetpassword/12345/confirm?clientid=client1&redirect_uri=https://local.test');
    });
  });

  describe('and the details are missing', () => {
    beforeEach(() => {
      req.body = {
        email: '',
      };
    });

    it('then it should render the request view',async () => {
      await postRequestPasswordReset(req, res);

      expect(res.render.mock.calls.length).toBe(1);
      expect(res.render.mock.calls[0][0]).toBe('ResetPassword/views/request');
    });

    it('then it should include the csrf token on the model', async () => {
      await postRequestPasswordReset(req, res);

      expect(res.render.mock.calls[0][1].csrfToken).toBe('token');
    });

    it('then it should be a validation failure', async () => {
      await postRequestPasswordReset(req, res);

      expect(res.render.mock.calls[0][1].validationFailed).toBe(true);
    });

    it('then it should include a validation message',async () => {
      await postRequestPasswordReset(req, res);

      expect(res.render.mock.calls[0][1].validationMessages.email).toBe('Please enter a valid email address');
    });
  });

  describe('and the details are invalid', () => {
    beforeEach(() => {
      req.body = {
        email: 'not-a-valid-email-address',
      };
    });

    it('then it should render the request view', async () => {
      await postRequestPasswordReset(req, res);

      expect(res.render.mock.calls.length).toBe(1);
      expect(res.render.mock.calls[0][0]).toBe('ResetPassword/views/request');
    });

    it('then it should include the csrf token on the model', async () => {
      await postRequestPasswordReset(req, res);

      expect(res.render.mock.calls[0][1].csrfToken).toBe('token');
    });

    it('then it should include the posted email', async () => {
      await postRequestPasswordReset(req, res);

      expect(res.render.mock.calls[0][1].email).toBe('not-a-valid-email-address');
    });

    it('then it should be a validation failure', async () => {
      await postRequestPasswordReset(req, res);

      expect(res.render.mock.calls[0][1].validationFailed).toBe(true);
    });

    it('then it should include a validation message', async () => {
      await postRequestPasswordReset(req, res);

      expect(res.render.mock.calls[0][1].validationMessages.email).toBe('Please enter a valid email address');
    });
  });

});
