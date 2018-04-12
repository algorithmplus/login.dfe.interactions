const utils = require('./../utils');
const getRequestPasswordReset = require('./../../src/app/migration/getConfirmMigratedEmail');

describe('When getting the confirm migrated email view', () => {

  let req;
  let res;

  beforeEach(() => {
    req = utils.mockRequest();
    res = utils.mockResponse();

    req.session.migrationUser = {
      clientName: 'TestClient',
    };
  });

  it('then it should render the migration intro view', () => {
    getRequestPasswordReset(req, res);

    expect(res.render.mock.calls.length).toBe(1);
    expect(res.render.mock.calls[0][0]).toBe('migration/views/confirmEmail');
  });

  it('then it should include the csrf token on the model', () => {
    getRequestPasswordReset(req, res);

    expect(res.render.mock.calls[0][1].csrfToken).toBe('token');
  });
});