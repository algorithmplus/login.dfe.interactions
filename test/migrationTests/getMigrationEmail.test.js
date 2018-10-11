const utils = require('./../utils');
const getRequestPasswordReset = require('./../../src/app/migration/getMigratedEmail');

describe('When getting the migration email view', () => {

  let req;
  let res;

  beforeEach(() => {
    req = utils.mockRequest();
    res = utils.mockResponse();

    req.migrationUser = {
      clientName: 'TestClient',
      firstName: 'Test',
      lastName: 'Tester',
    };
  });

  it('then it should render the migration no-email view when the user has no email', () => {
    getRequestPasswordReset(req, res);

    expect(res.render.mock.calls.length).toBe(1);
    expect(res.render.mock.calls[0][0]).toBe('migration/views/no-email');
  });

  it('then it should render the migration email view when the user has an email', () => {
    req.migrationUser.email = 'test@tester.local';

    getRequestPasswordReset(req, res);

    expect(res.render.mock.calls.length).toBe(1);
    expect(res.render.mock.calls[0][0]).toBe('migration/views/email');
  });

  it('then it should include the csrf token on the model', () => {
    getRequestPasswordReset(req, res);

    expect(res.render.mock.calls[0][1].csrfToken).toBe('token');
  });

  it('then it should pass the user from the session to the view', () => {
    getRequestPasswordReset(req, res);

    expect(res.render.mock.calls[0][1].user).toMatchObject(req.migrationUser);
  });

  it('then it should pass the view being displayed to the view', () => {
    getRequestPasswordReset(req, res);

    expect(res.render.mock.calls[0][1].viewToDisplay).toBe('migration/views/no-email');
  });
});