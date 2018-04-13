const utils = require('./../utils');
const getCreateNewPassword = require('./../../src/app/migration/getCreateNewPassword');

describe('When getting the Create new Password view', () => {

  let req;
  let res;

  beforeEach(() => {
    req = utils.mockRequest();
    res = utils.mockResponse();

    req.session.userCode = 'ZXT567';
  });

  it('then it should render the create password view', () => {
    getCreateNewPassword(req, res);

    expect(res.render.mock.calls.length).toBe(1);
    expect(res.render.mock.calls[0][0]).toBe('migration/views/createPassword');
  });

  it('then it should include the csrf token on the model', () => {
    getCreateNewPassword(req, res);

    expect(res.render.mock.calls[0][1].csrfToken).toBe('token');
  });

  it('then if no user code is in the session an error is thrown', () => {
    getCreateNewPassword(req, res);
  });

  it('then the user code from the session is passed to the view', () => {
    getCreateNewPassword(req, res);

    expect(res.render.mock.calls[0][1].code).toBe('ZXT567');
  });
});