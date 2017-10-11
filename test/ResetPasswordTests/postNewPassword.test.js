const {expect} = require('chai');
const sinon = require('sinon');
const postNewPassword = require('../../src/app/ResetPassword/postNewPassword');

const req = {
  params: {
    uuid: '123-abc'
  },
  csrfToken: () => { return 'token' }
};
const res = {
  render: (view, model) => {},
  redirect: (url) => {}
};

describe('when posting new password', () => {

  beforeEach(() => {
    sinon.spy(res, 'render');
    sinon.spy(res, 'redirect');
  });
  afterEach(() => {
    res.render.restore();
    res.redirect.restore();
  });

  describe('and the details are valid', () => {

    beforeEach(() => {
      req.body = {
        newPassword: 'mary-had-a-little-lamb',
        confirmPassword: 'mary-had-a-little-lamb'
      }
    });

    it('then it should redirect to complete', () => {
      postNewPassword(req, res);

      expect(res.redirect.getCall(0).args[0]).to.equal('/123-abc/resetpassword/complete');
    });

  });

  describe('and new password is missing', () => {

    beforeEach(() => {
      req.body = {
        newPassword: '',
        confirmPassword: 'mary-had-a-little-lamb'
      }
    });

    it('then it should render the newpassword view', () => {
      postNewPassword(req, res);

      expect(res.render.getCall(0).args[0]).to.equal('ResetPassword/views/newpassword');
    });

    it('then it should include the csrf token on the model', () => {
      postNewPassword(req, res);

      expect(res.render.getCall(0).args[1].csrfToken).to.equal('token');
    });

    it('then it should include a blank new password', () => {
      postNewPassword(req, res);

      expect(res.render.getCall(0).args[1].newPassword).to.equal('');
    });

    it('then it should include a blank confirm password', () => {
      postNewPassword(req, res);

      expect(res.render.getCall(0).args[1].confirmPassword).to.equal('');
    });

    it('then it should be a validation failure', () => {
      postNewPassword(req, res);

      expect(res.render.getCall(0).args[1].validationFailed).to.equal(true);
    });

    it('then it should include a validation message for password', () => {
      postNewPassword(req, res);

      expect(res.render.getCall(0).args[1].validationMessages.newPassword).to.equal('Please enter your new password');
    });

  });

  describe('and confirm password is missing', () => {

    beforeEach(() => {
      req.body = {
        newPassword: 'mary-had-a-little-lamb',
        confirmPassword: ''
      }
    });

    it('then it should render the newpassword view', () => {
      postNewPassword(req, res);

      expect(res.render.getCall(0).args[0]).to.equal('ResetPassword/views/newpassword');
    });

    it('then it should include the csrf token on the model', () => {
      postNewPassword(req, res);

      expect(res.render.getCall(0).args[1].csrfToken).to.equal('token');
    });

    it('then it should include a blank new password', () => {
      postNewPassword(req, res);

      expect(res.render.getCall(0).args[1].newPassword).to.equal('');
    });

    it('then it should include a blank confirm password', () => {
      postNewPassword(req, res);

      expect(res.render.getCall(0).args[1].confirmPassword).to.equal('');
    });

    it('then it should be a validation failure', () => {
      postNewPassword(req, res);

      expect(res.render.getCall(0).args[1].validationFailed).to.equal(true);
    });

    it('then it should include a validation message for confirm password', () => {
      postNewPassword(req, res);

      expect(res.render.getCall(0).args[1].validationMessages.confirmPassword).to.equal('Please confirm your new password');
    });

  });

  describe('and confirm password does not match new password', () => {

    beforeEach(() => {
      req.body = {
        newPassword: 'mary-had-a-little-lamb',
        confirmPassword: 'mary-had-a-large-lamb'
      }
    });

    it('then it should render the newpassword view', () => {
      postNewPassword(req, res);

      expect(res.render.getCall(0).args[0]).to.equal('ResetPassword/views/newpassword');
    });

    it('then it should include the csrf token on the model', () => {
      postNewPassword(req, res);

      expect(res.render.getCall(0).args[1].csrfToken).to.equal('token');
    });

    it('then it should include a blank new password', () => {
      postNewPassword(req, res);

      expect(res.render.getCall(0).args[1].newPassword).to.equal('');
    });

    it('then it should include a blank confirm password', () => {
      postNewPassword(req, res);

      expect(res.render.getCall(0).args[1].confirmPassword).to.equal('');
    });

    it('then it should be a validation failure', () => {
      postNewPassword(req, res);

      expect(res.render.getCall(0).args[1].validationFailed).to.equal(true);
    });

    it('then it should include a validation message for confirm password', () => {
      postNewPassword(req, res);

      expect(res.render.getCall(0).args[1].validationMessages.confirmPassword).to.equal('Passwords do not match');
    });

  });

});