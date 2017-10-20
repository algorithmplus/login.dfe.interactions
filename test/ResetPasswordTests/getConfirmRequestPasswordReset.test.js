const utils = require('./../utils');
const getRequestPasswordReset = require('./../../src/app/ResetPassword/getConfirmPasswordReset');

describe('When getting the confirm password reset view', () => {

  let req;
  let res;

  beforeEach(() => {
    req = utils.mockRequest();
    res = utils.mockResponse();
  });

  it('then it should render the confirm view', () => {
    getRequestPasswordReset(req, res);

    expect(res.render.mock.calls.length).toBe(1);
    expect(res.render.mock.calls[0][0]).toBe('ResetPassword/views/confirm');
  });

  it('then it should include the csrf token on the model', () => {
    getRequestPasswordReset(req, res);

    expect(res.render.mock.calls[0][1].csrfToken).toBe('token');
  });

  it('then it should include a blank email', () => {
    getRequestPasswordReset(req, res);

    expect(res.render.mock.calls[0][1].email).toBe('');
  });

  it('then it should include a blank code', () => {
    getRequestPasswordReset(req, res);

    expect(res.render.mock.calls[0][1].code).toBe('');
  });

  it('then it should not be a validation failure', () => {
    getRequestPasswordReset(req, res);

    expect(res.render.mock.calls[0][1].validationFailed).toBe(false);
  });

});