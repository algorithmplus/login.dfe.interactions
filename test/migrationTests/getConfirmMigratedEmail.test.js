jest.mock('./../../src/infrastructure/UserCodes');
jest.mock('./../../src/infrastructure/Config', () => jest.fn().mockImplementation(() => ({
  hostingEnvironment: {
    agentKeepAlive: {},
  },
})));
const utils = require('./../utils');
const getRequestPasswordReset = require('./../../src/app/migration/getConfirmMigratedEmail');

describe('When getting the confirm migrated email view', () => {
  let req;
  let res;
  let getCodeStub;
  const exepectedEmailAddress = 'test@local';

  beforeEach(() => {
    req = utils.mockRequest();
    res = utils.mockResponse().mockResetAll();

    getCodeStub = jest.fn().mockReset().mockReturnValue({ userCode: { code: 'ABC123', email: exepectedEmailAddress } });
    const userCodes = require('./../../src/infrastructure/UserCodes');
    userCodes.getCode = getCodeStub;
  });

  it('then it should render the migration intro view', async () => {
    await getRequestPasswordReset(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('migration/views/confirmEmail');
  });

  it('then it should include the csrf token on the model', async () => {
    await getRequestPasswordReset(req, res);

    expect(res.render.mock.calls[0][1].csrfToken).toBe('token');
  });

  it('then the user code is found from the url params and email is populated in the view', async () => {
    req.params.emailConfId = 'some-newid';

    await getRequestPasswordReset(req, res);

    expect(getCodeStub.mock.calls).toHaveLength(1);
    expect(getCodeStub.mock.calls[0][0]).toBe(req.params.emailConfId);
    expect(getCodeStub.mock.calls[0][1]).toBe(req.id);
    expect(getCodeStub.mock.calls[0][2]).toBe('ConfirmMigratedEmail');
    expect(res.render.mock.calls[0][1].email).toBe(exepectedEmailAddress);
  });

  it('then if the code is not in the url a 410 result is returned', async () => {
    getCodeStub.mockReset().mockReturnValue(null);

    await getRequestPasswordReset(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(410);
    expect(res.render).toHaveBeenCalledTimes(1);
    expect(res.render.mock.calls[0][0]).toBe('migration/views/alreadyMigrated');
  });
});
