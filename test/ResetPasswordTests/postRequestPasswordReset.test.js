const {expect} = require('chai');
const sinon = require('sinon');
const postRequestPasswordReset = require('../../src/app/ResetPassword/postRequestPasswordReset');

const req = {
  csrfToken: () => { return 'token' }
};
const res = {
  render: (view, model) => {
  }
};

describe('when handling the posting of a password reset request', () => {

  beforeEach(() => {
    sinon.spy(res, 'render');
  });
  afterEach(() => {
    res.render.restore();
  });

  describe('and the details are valid', () => {

    beforeEach(() => {
      req.body = {
        email: 'user.one@unit.tests'
      }
    });

    it('then it should render the codesent view', () => {
      postRequestPasswordReset(req, res);

      expect(res.render.getCall(0).args[0]).to.equal('resetpassword/codesent');
    });

  });

  describe('and the details are missing', () => {

    beforeEach(() => {
      req.body = {
        email: ''
      }
    });

    it('then it should render the request view', () => {
      postRequestPasswordReset(req, res);

      expect(res.render.getCall(0).args[0]).to.equal('resetpassword/request');
    });

    it('then it should include the csrf token on the model', () => {
      postRequestPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].csrfToken).to.equal('token');
    });

    it('then it should be a validation failure', () => {
      postRequestPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].validationFailed).to.equal(true);
    });

    it('then it should include a validation message', () => {
      postRequestPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].validationMessages.email).to.equal('Please enter a valid email address');
    });

  });

  describe('and the details are invalid', () => {

    beforeEach(() => {
      req.body = {
        email: 'not-a-valid-email-address'
      }
    });

    it('then it should render the request view', () => {
      postRequestPasswordReset(req, res);

      expect(res.render.getCall(0).args[0]).to.equal('resetpassword/request');
    });

    it('then it should include the csrf token on the model', () => {
      postRequestPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].csrfToken).to.equal('token');
    });

    it('then it should include the posted email', () => {
      postRequestPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].email).to.equal('not-a-valid-email-address');
    });

    it('then it should be a validation failure', () => {
      postRequestPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].validationFailed).to.equal(true);
    });

    it('then it should include a validation message', () => {
      postRequestPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].validationMessages.email).to.equal('Please enter a valid email address');
    });

  });

});