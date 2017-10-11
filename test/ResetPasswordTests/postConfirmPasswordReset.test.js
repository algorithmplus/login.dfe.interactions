const {expect} = require('chai');
const sinon = require('sinon');
const postRequestPasswordReset = require('../../src/app/ResetPassword/postConfirmPasswordReset');

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

describe('When posting the confirm password reset view', () => {

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
        email: 'user.one@unit.test',
        code: '123456'
      }
    });

    it('then it should redirect to newpassword', () => {
      postRequestPasswordReset(req, res);

      expect(res.redirect.getCall(0).args[0]).to.equal('/123-abc/resetpassword/newpassword');
    });

  });

  describe('and the email is missing', () => {

    beforeEach(() => {
      req.body = {
        email: '',
        code: '123456'
      }
    });

    it('then it should render the confirm view', () => {
      postRequestPasswordReset(req, res);

      expect(res.render.getCall(0).args[0]).to.equal('ResetPassword/views/confirm');
    });

    it('then it should include the csrf token on the model', () => {
      postRequestPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].csrfToken).to.equal('token');
    });

    it('then it should include the posted code', () => {
      postRequestPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].code).to.equal('123456');
    });

    it('then it should be a validation failure', () => {
      postRequestPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].validationFailed).to.equal(true);
    });

    it('then it should include a validation message for email', () => {
      postRequestPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].validationMessages.email).to.equal('Please enter a valid email address');
    });

  });

  describe('and the code is missing', () => {

    beforeEach(() => {
      req.body = {
        email: 'user.one@unit.test',
        code: ''
      }
    });

    it('then it should render the confirm view', () => {
      postRequestPasswordReset(req, res);

      expect(res.render.getCall(0).args[0]).to.equal('ResetPassword/views/confirm');
    });

    it('then it should include the csrf token on the model', () => {
      postRequestPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].csrfToken).to.equal('token');
    });

    it('then it should include the posted email', () => {
      postRequestPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].email).to.equal('user.one@unit.test');
    });

    it('then it should be a validation failure', () => {
      postRequestPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].validationFailed).to.equal(true);
    });

    it('then it should include a validation message for code', () => {
      postRequestPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].validationMessages.code).to.equal('Please enter the code that was emailed to you');
    });

  });

  describe('and the email is invalid', () => {

    beforeEach(() => {
      req.body = {
        email: 'not-a-valid-email-address',
        code: '123456'
      }
    });

    it('then it should render the confirm view', () => {
      postRequestPasswordReset(req, res);

      expect(res.render.getCall(0).args[0]).to.equal('ResetPassword/views/confirm');
    });

    it('then it should include the csrf token on the model', () => {
      postRequestPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].csrfToken).to.equal('token');
    });

    it('then it should include the posted email', () => {
      postRequestPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].email).to.equal('not-a-valid-email-address');
    });

    it('then it should include the posted code', () => {
      postRequestPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].code).to.equal('123456');
    });

    it('then it should be a validation failure', () => {
      postRequestPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].validationFailed).to.equal(true);
    });

    it('then it should include a validation message for email', () => {
      postRequestPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].validationMessages.email).to.equal('Please enter a valid email address');
    });

  });

});