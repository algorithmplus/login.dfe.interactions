const utils = require('./../utils');
const getRequestPasswordReset = require('./../../src/app/migration/getMigratedUserDetails');

describe('When getting the migration user details view', () => {

  let req;
  let res;

  beforeEach(() => {
    req = utils.mockRequest();
    res = utils.mockResponse();

    req.session.migrationUser = {
      clientName: 'TestClient',
      firstName: 'Test',
      lastName: 'Tester',
    };
  });

  it('then it should render the migration user detail view', () => {
    getRequestPasswordReset(req, res);

    expect(res.render.mock.calls.length).toBe(1);
    expect(res.render.mock.calls[0][0]).toBe('migration/views/userDetail');
  });

  it('then it should include the csrf token on the model', () => {
    getRequestPasswordReset(req, res);

    expect(res.render.mock.calls[0][1].csrfToken).toBe('token');
  });

  it('then it should pass the user from the session to the view', () => {
    getRequestPasswordReset(req, res);

    expect(res.render.mock.calls[0][1].user).toMatchObject(req.session.migrationUser);
  })
});