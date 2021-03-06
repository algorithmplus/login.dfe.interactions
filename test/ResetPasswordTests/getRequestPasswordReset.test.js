jest.mock('./../../src/infrastructure/applications', () => ({
  getServiceById: jest.fn(),
}));

const utils = require('./../utils');
const applications = require('./../../src/infrastructure/applications');
const getRequestPasswordReset = require('./../../src/app/ResetPassword/getRequestPasswordReset');

describe('When getting the request password reset view', () => {
  let req;
  let res;

  beforeEach(() => {
    req = utils.mockRequest();
    res = utils.mockResponse();
    req.query.clientid = 'client-1';
    req.query.redirect_uri = 'https://sometest.local/redirect';
    applications.getServiceById.mockReset();
    applications.getServiceById.mockReturnValue({
      relyingParty: {
        client_id: req.query.clientId,
        client_secret: 'secret',
        redirect_uris: ['https://sometest.local/redirect'],
      },
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

  it('then the client is retrieved from applications api', async () => {
    await getRequestPasswordReset(req, res);

    expect(applications.getServiceById.mock.calls).toHaveLength(1);
    expect(applications.getServiceById.mock.calls[0][0]).toBe(req.query.clientid);
    expect(applications.getServiceById.mock.calls[0][1]).toBe(req.id);
  });

  it('then if the return url does not match the client information a bad request is returned', async () => {
    applications.getServiceById.mockReturnValue({
      client_id: req.query.clientid,
      client_secret: 'secret',
      redirect_uris: ['https://test.local'],
    });

    let error = null;
    try {
      await getRequestPasswordReset(req, res);
    } catch (e) {
      error = e;
    }

    expect(error).not.toBeNull();
    expect(error.message).toBe(`Invalid redirect_uri (clientid: ${req.query.clientid}, redirect_uri: ${req.query.redirect_uri}) - redirect_uri not in list of specified redirect_uris`);
  });

  it('then if no client is returned a bad request is returned', async () => {
    applications.getServiceById.mockReset();
    applications.getServiceById.mockReturnValue(null);

    let error = null;
    try {
      await getRequestPasswordReset(req, res);
    } catch (e) {
      error = e;
    }

    expect(error).not.toBeNull();
    expect(error.message).toBe(`Invalid redirect_uri (clientid: ${req.query.clientid}, redirect_uri: ${req.query.redirect_uri}) - no client by that id`);
  });

  it('then if the client has a postRedirectUrl that is used instead of the redirectUri', async () => {
    applications.getServiceById.mockReturnValue({
      relyingParty: {
        client_id: req.query.clientid,
        client_secret: 'secret',
        postResetUrl: 'https://test.local.new',
      },
    });

    await getRequestPasswordReset(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][1]).toMatchObject({
      redirectUri: 'https://test.local.new',
    });
  });
});
