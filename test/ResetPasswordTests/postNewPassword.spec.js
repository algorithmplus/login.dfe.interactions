jest.mock('./../../src/Clients');
jest.mock('./../../src/Users');
jest.mock('./../../src/UserCodes');

describe('when posting new password', () => {

  const client = {};
  let clientsGet;

  let userAdapterChangePassword;

  let userCodesDeleteCode;

  const req = {
    params: {
      uuid: '123-abc'
    },
    session: {
      clientId: 'UnitTests',
      uid: 'user1',
    },
    csrfToken: () => {
      return 'token'
    }
  };

  let render;
  let redirect;
  let res;

  let postNewPassword;

  beforeEach(() => {
    clientsGet = jest.fn().mockReturnValue(client);

    const clients = require('./../../src/Clients');
    clients.get = clientsGet;

    userAdapterChangePassword = jest.fn();
    const userAdapter = require('./../../src/Users');
    userAdapter.changePassword = userAdapterChangePassword;

    userCodesDeleteCode = jest.fn().mockReturnValue(true);
    const userCodes = require('./../../src/UserCodes');
    userCodes.deleteCode = userCodesDeleteCode;

    render = jest.fn();
    redirect = jest.fn();
    res = {
      render,
      redirect
    };

    postNewPassword = require('../../src/app/ResetPassword/postNewPassword');
  });

  describe('and the details are valid', () => {

    beforeEach(() => {
      req.body = {
        newPassword: 'mary-had-a-little-lamb',
        confirmPassword: 'mary-had-a-little-lamb'
      }
    });

    it('then it should redirect to complete', async () => {
      await postNewPassword(req, res);

      expect(redirect.mock.calls.length).toBe(1);
      expect(redirect.mock.calls[0][0]).toBe('/123-abc/resetpassword/complete');
    });

    it('then it should change the users password', async () => {
      await postNewPassword(req, res);

      expect(userAdapterChangePassword.mock.calls.length).toBe(1);
      expect(userAdapterChangePassword.mock.calls[0][0]).toBe(req.session.uid);
      expect(userAdapterChangePassword.mock.calls[0][1]).toBe(req.body.newPassword);
      expect(userAdapterChangePassword.mock.calls[0][2]).toBe(client);
    });

    it('then it should delete the users reset codes', async () => {
      await postNewPassword(req, res);

      expect(userCodesDeleteCode.mock.calls.length).toBe(1);
      expect(userCodesDeleteCode.mock.calls[0][0]).toBe(req.session.uid);
    });

  });

  describe('and new password is missing', () => {

    beforeEach(() => {
      req.body = {
        newPassword: '',
        confirmPassword: 'mary-had-a-little-lamb'
      }
    });

    it('then it should render the newpassword view', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls.length).toBe(1);
      expect(render.mock.calls[0][0]).toBe('ResetPassword/views/newpassword');
    });

    it('then it should include the csrf token on the model', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls[0][1].csrfToken).toBe('token');
    });

    it('then it should include a blank new password', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls[0][1].newPassword).toBe('');
    });

    it('then it should include a blank confirm password', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls[0][1].confirmPassword).toBe('');
    });

    it('then it should be a validation failure', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls[0][1].validationFailed).toBe(true);
    });

    it('then it should include a validation message for password', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls[0][1].validationMessages.newPassword).toBe('Please enter your new password');
    });

  });

  describe('and confirm password is missing', () => {

    beforeEach(() => {
      req.body = {
        newPassword: 'mary-had-a-little-lamb',
        confirmPassword: ''
      }
    });

    it('then it should render the newpassword view', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls.length).toBe(1);
      expect(render.mock.calls[0][0]).toBe('ResetPassword/views/newpassword');
    });

    it('then it should include the csrf token on the model', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls[0][1].csrfToken).toBe('token');
    });

    it('then it should include a blank new password', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls[0][1].newPassword).toBe('');
    });

    it('then it should include a blank confirm password', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls[0][1].confirmPassword).toBe('');
    });

    it('then it should be a validation failure', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls[0][1].validationFailed).toBe(true);
    });

    it('then it should include a validation message for confirm password', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls[0][1].validationMessages.confirmPassword).toBe('Please confirm your new password');
    });

  });

  describe('and confirm password does not match new password', () => {

    beforeEach(() => {
      req.body = {
        newPassword: 'mary-had-a-little-lamb',
        confirmPassword: 'mary-had-a-large-lamb'
      }
    });

    it('then it should render the newpassword view', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls.length).toBe(1);
      expect(render.mock.calls[0][0]).toBe('ResetPassword/views/newpassword');
    });

    it('then it should include the csrf token on the model', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls[0][1].csrfToken).toBe('token');
    });

    it('then it should include a blank new password', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls[0][1].newPassword).toBe('');
    });

    it('then it should include a blank confirm password', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls[0][1].confirmPassword).toBe('');
    });

    it('then it should be a validation failure', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls[0][1].validationFailed).toBe(true);
    });

    it('then it should include a validation message for confirm password', async () => {
      await postNewPassword(req, res);

      expect(render.mock.calls[0][1].validationMessages.confirmPassword).toBe('Passwords do not match');
    });

  });

});