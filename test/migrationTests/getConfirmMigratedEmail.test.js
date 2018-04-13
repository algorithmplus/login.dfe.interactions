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
    res = utils.mockResponse();

    getCodeStub = jest.fn().mockReset().mockReturnValue({ code: 'ABC123', email: exepectedEmailAddress });
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
    await getRequestPasswordReset(req, res);

    expect(getCodeStub.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][1].email).toBe(exepectedEmailAddress);
  });

  it('then if the code is not in the url an error is thrown', async () => {
    let message;
    getCodeStub.mockReset().mockReturnValue(null)

    try {
      await getRequestPasswordReset(req, res);
    } catch (e) {
      message = e.message;

    }
    expect(message).toBe('Invalid Request');
  });
});
