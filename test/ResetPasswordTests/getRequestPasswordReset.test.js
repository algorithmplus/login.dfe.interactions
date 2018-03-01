jest.mock('./../../src/infrastructure/Clients', () => ({
  get: jest.fn(),
}));

const utils = require('./../utils');
const hotConfig = require('./../../src/infrastructure/Clients');
const getRequestPasswordReset = require('./../../src/app/ResetPassword/getRequestPasswordReset');

describe('When getting the request password reset view', () => {
  let req;
  let res;

  beforeEach(() => {
    req = utils.mockRequest();
    res = utils.mockResponse();
    req.query.clientid = 'client-1';
    req.query.redirect_uri = 'https://sometest.local/redirect';
    hotConfig.get.mockReset();
    hotConfig.get.mockReturnValue({
      client_id: req.query.clientId,
      client_secret: 'secret',
      redirect_uris: ['https://sometest.local/redirect'],
    });
  });

  it('then it should render the request view', async () => {
    await getRequestPasswordReset(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('ResetPassword/views/request');
  });

  it('then it should include the csrf token on the model', async () => {
    await getRequestPasswordReset(req, res);

    expect(res.render.mock.calls[0][1].csrfToken).toBe('token');
  });

  it('then it should include a blank email', async () => {
    await getRequestPasswordReset(req, res);

    expect(res.render.mock.calls[0][1].email).toBe('');
  });

  it('then it should not be a validation failure', async () => {
    await getRequestPasswordReset(req, res);

    expect(res.render.mock.calls[0][1].validationFailed).toBe(false);
  });

  it('then the client is retrieved from hotconfig api', async () => {
    await getRequestPasswordReset(req, res);

    expect(hotConfig.get.mock.calls).toHaveLength(1);
    expect(hotConfig.get.mock.calls[0][0]).toBe(req.query.clientId);
    expect(hotConfig.get.mock.calls[0][1]).toBe(req.id);
  });

  it('then if the return url does not match the client information a bad request is returned', async () => {
    hotConfig.get.mockReturnValue({
      client_id: req.query.clientId,
      client_secret: 'secret',
      redirect_uris: ['https://test.local'],
    });


    await getRequestPasswordReset(req, res);

    expect(res.redirect.mock.calls[0][0]).toBe('/error');
  });

  it('then if no client is returned a bad request is returned', async () => {
    hotConfig.get.mockReset();
    hotConfig.get.mockReturnValue(null);

    await getRequestPasswordReset(req, res);

    expect(res.redirect.mock.calls[0][0]).toBe('/error');
  });
});
