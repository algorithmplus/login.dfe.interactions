const utils = require('./../utils');
const getRequestPasswordReset = require('./../../src/app/migration/getMigrationIntro');

describe('When getting the migration intro view', () => {

  let req;
  let res;

  beforeEach(() => {
    req = utils.mockRequest();
    res = utils.mockResponse();

    req.migrationUser = {
      clientName: 'TestClient',
    };
  });

  it('then it should render the migration intro view', () => {
    getRequestPasswordReset(req, res);

    expect(res.render.mock.calls.length).toBe(1);
    expect(res.render.mock.calls[0][0]).toBe('migration/views/migrationIntro');
  });

  it('then it should include the csrf token on the model', () => {
    getRequestPasswordReset(req, res);

    expect(res.render.mock.calls[0][1].csrfToken).toBe('token');
  });

  it('then it should pass the client name to the view', () => {
    getRequestPasswordReset(req, res);

    expect(res.render.mock.calls[0][1].serviceName).toBe('TestClient');
  })
});