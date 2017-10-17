const {expect} = require('chai');
const sinon = require('sinon');
const getRequestPasswordReset = require('../../src/app/ResetPassword/getNewPassword');

const req = {
  csrfToken: () => { return 'token' }
};
const res = {
  render: (view, model) => {
  }
};

describe('When getting the new password view', () => {

  beforeEach(() => {
    sinon.spy(res, 'render');
  });
  afterEach(() => {
    res.render.restore();
  });

  it('then it should render the newpassword view', () => {
    getRequestPasswordReset(req, res);

    expect(res.render.getCall(0).args[0]).to.equal('ResetPassword/views/newpassword');
  });

  it('then it should include the csrf token on the model', () => {
    getRequestPasswordReset(req, res);

    expect(res.render.getCall(0).args[1].csrfToken).to.equal('token');
  });

  it('then it should include a blank new password', () => {
    getRequestPasswordReset(req, res);

    expect(res.render.getCall(0).args[1].newPassword).to.equal('');
  });

  it('then it should include a blank confirm password', () => {
    getRequestPasswordReset(req, res);

    expect(res.render.getCall(0).args[1].confirmPassword).to.equal('');
  });

  it('then it should not be a validation failure', () => {
    getRequestPasswordReset(req, res);

    expect(res.render.getCall(0).args[1].validationFailed).to.equal(false);
  });

});