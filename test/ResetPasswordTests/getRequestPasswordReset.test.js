const {expect} = require('chai');
const sinon = require('sinon');
const getRequestPasswordReset = require('../../src/app/ResetPassword/getRequestPasswordReset');

const req = {
  csrfToken: () => { return 'token' }
};
const res = {
  render: (view, model) => {
  }
};

describe('When getting the request password reset view', () => {

  beforeEach(() => {
    sinon.spy(res, 'render');
  });
  afterEach(() => {
    res.render.restore();
  });

  it('then it should render the request view', () => {
    getRequestPasswordReset(req, res);

    expect(res.render.getCall(0).args[0]).to.equal('ResetPassword/views/request');
  });

  it('then it should include the csrf token on the model', () => {
    getRequestPasswordReset(req, res);

    expect(res.render.getCall(0).args[1].csrfToken).to.equal('token');
  });

  it('then it should include a blank email', () => {
    getRequestPasswordReset(req, res);

    expect(res.render.getCall(0).args[1].email).to.equal('');
  });

  it('then it should not be a validation failure', () => {
    getRequestPasswordReset(req, res);

    expect(res.render.getCall(0).args[1].validationFailed).to.equal(false);
  });

  it('then it should not be a validation messages should be blank', () => {
    getRequestPasswordReset(req, res);

    expect(res.render.getCall(0).args[1].validationMessages.email).to.equal('');
  });

});