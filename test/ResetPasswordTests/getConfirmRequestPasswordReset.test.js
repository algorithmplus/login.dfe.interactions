const {expect} = require('chai');
const sinon = require('sinon');
const getRequestPasswordReset = require('../../src/app/ResetPassword/getConfirmPasswordReset');

const req = {
  csrfToken: () => { return 'token' }
};
const res = {
  render: (view, model) => {
  }
};

describe('When getting the confirm password reset view', () => {

  beforeEach(() => {
    sinon.spy(res, 'render');
  });
  afterEach(() => {
    res.render.restore();
  });

  it('then it should render the confirm view', () => {
    getRequestPasswordReset(req, res);

    expect(res.render.getCall(0).args[0]).to.equal('ResetPassword/views/confirm');
  });

  it('then it should include the csrf token on the model', () => {
    getRequestPasswordReset(req, res);

    expect(res.render.getCall(0).args[1].csrfToken).to.equal('token');
  });

  it('then it should include a blank email', () => {
    getRequestPasswordReset(req, res);

    expect(res.render.getCall(0).args[1].email).to.equal('');
  });

  it('then it should include a blank code', () => {
    getRequestPasswordReset(req, res);

    expect(res.render.getCall(0).args[1].code).to.equal('');
  });

  it('then it should not be a validation failure', () => {
    getRequestPasswordReset(req, res);

    expect(res.render.getCall(0).args[1].validationFailed).to.equal(false);
  });

});