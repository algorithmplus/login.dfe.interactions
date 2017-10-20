const utils = require('../utils');

jest.mock('../../src/infrastructure/Clients');
jest.mock('../../src/infrastructure/UserCodes');
jest.mock('../../src/infrastructure/Users');

describe('When posting the confirm password reset view', () => {

  let req;
  let res;
  let clientsGet;
  let userCodesValidateCode;
  let usersFind;

  let postConfirmPasswordReset;

  beforeEach(() => {
    req = utils.mockRequest();
    res = utils.mockResponse();

    clientsGet = jest.fn();
    const clients = require('../../src/infrastructure/Clients');
    clients.get = clientsGet;

    userCodesValidateCode = jest.fn().mockReturnValue({ code: '' });
    const userCodes = require('../../src/infrastructure/UserCodes');
    userCodes.validateCode = userCodesValidateCode;

    usersFind = jest.fn().mockReturnValue({ sub: '12345' });
    const users = require('../../src/infrastructure/Users');
    users.find = usersFind;

    postConfirmPasswordReset = require('../../src/app/ResetPassword/postConfirmPasswordReset');
  });

  describe('and the details are valid', () => {

    beforeEach(() => {
      req.body = {
        email: 'user.one@unit.test',
        code: '123456',
      };
      req.query = {
        clientid: 'client1',
      };


    });

    it('then the client is retrieved from the hotconfig adapter', async () => {
      await postConfirmPasswordReset(req, res);

      expect(clientsGet.mock.calls.length).toBe(1);
    });

    it('then the user is retrieved from the directories api', async () => {
      await postConfirmPasswordReset(req, res);

      expect(usersFind.mock.calls.length).toBe(1);
      expect(usersFind.mock.calls[0][0]).toBe('user.one@unit.test');
    });

    it('then a user code is validated for that user id', async () => {
      usersFind.mockReturnValue({ sub: '12345EDC' });

      await postConfirmPasswordReset(req, res);

      expect(userCodesValidateCode.mock.calls.length).toBe(1);
      expect(userCodesValidateCode.mock.calls[0][0]).toBe('12345EDC');
      expect(userCodesValidateCode.mock.calls[0][1]).toBe('123456');
    });

    it('then it should redirect to newpassword view', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.redirect.mock.calls[0][0]).toBe('/123-abc/resetpassword/newpassword');
    });
  });

  describe('and the email is missing', () => {
    beforeEach(() => {
      req.body = {
        email: '',
        code: '123456',
      };
    });

    it('then it should render the confirm view', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.mock.calls.length).toBe(1);
      expect(res.render.mock.calls[0][0]).toBe('ResetPassword/views/confirm');
    });

    it('then it should include the csrf token on the model', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.mock.calls[0][1].csrfToken).toBe('token');
    });

    it('then it should include the posted code', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.mock.calls[0][1].code).toBe('123456');
    });

    it('then it should be a validation failure', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.mock.calls[0][1].validationFailed).toBe(true);
    });

    it('then it should include a validation message for email', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.mock.calls[0][1].validationMessages.email).toBe('Please enter a valid email address');
    });
  });

  describe('and the code is missing', () => {
    beforeEach(() => {
      req.body = {
        email: 'user.one@unit.test',
        code: '',
      };
    });

    it('then it should render the confirm view', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.mock.calls.length).toBe(1)
      expect(res.render.mock.calls[0][0]).toBe('ResetPassword/views/confirm');
    });

    it('then it should include the csrf token on the model', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.mock.calls[0][1].csrfToken).toBe('token');
    });

    it('then it should include the posted email', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.mock.calls[0][1].email).toBe('user.one@unit.test');
    });

    it('then it should be a validation failure', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.mock.calls[0][1].validationFailed).toBe(true);
    });

    it('then it should include a validation message for code', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.mock.calls[0][1].validationMessages.code).toBe('Please enter the code that was emailed to you');
    });
  });

  describe('and the email is invalid', () => {
    beforeEach(() => {
      req.body = {
        email: 'not-a-valid-email-address',
        code: '123456',
      };
    });

    it('then it should render the confirm view', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.mock.calls.length).toBe(1);
      expect(res.render.mock.calls[0][0]).toBe('ResetPassword/views/confirm');
    });

    it('then it should include the csrf token on the model', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.mock.calls[0][1].csrfToken).toBe('token');
    });

    it('then it should include the posted email', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.mock.calls[0][1].email).toBe('not-a-valid-email-address');
    });

    it('then it should include the posted code', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.mock.calls[0][1].code).toBe('123456');
    });

    it('then it should be a validation failure', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.mock.calls[0][1].validationFailed).toBe(true);
    });

    it('then it should include a validation message for email', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.mock.calls[0][1].validationMessages.email).toBe('Please enter a valid email address');
    });
  });

});
