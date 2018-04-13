jest.mock('./../../src/infrastructure/UserCodes');
jest.mock('./../../src/infrastructure/Config', () => jest.fn().mockImplementation(() => ({
  hostingEnvironment: {
    agentKeepAlive: {},
  },
})));

const utils = require('./../utils');
const postConfirmMigratedEmail = require('./../../src/app/migration/postConfirmMigratedEmail');

describe('When posting to confirm the migration email userCode', () => {
  let req;
  let res;
  let userCodesValidateCode;
  const expectedCode = 'ZXY123';
  const expectedEmail = 'test@tester.local';
  const expectedUserCodeId = 'some-uid';

  beforeEach(() => {
    req = utils.mockRequest();
    res = utils.mockResponse();

    req.body = {
      code: expectedCode,
      email: expectedEmail,
      emailConfId: expectedUserCodeId,
    };

    userCodesValidateCode = jest.fn().mockReset().mockReturnValue({code: ''});
    const userCodes = require('./../../src/infrastructure/UserCodes');
    userCodes.validateCode = userCodesValidateCode;
  });

  it('then if the code is empty an error is returned', async () => {
    req.body.code = '';

    await postConfirmMigratedEmail(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][1].validationFailed).toBe(true);
    expect(req.session.userCode).toBe(undefined);
  });

  it('then the code is checked against the API', async () => {
    await postConfirmMigratedEmail(req, res);

    expect(userCodesValidateCode.mock.calls).toHaveLength(1);
    expect(userCodesValidateCode.mock.calls[0][0]).toBe(expectedUserCodeId);
    expect(userCodesValidateCode.mock.calls[0][1]).toBe(expectedCode);
    expect(userCodesValidateCode.mock.calls[0][2]).toBe(req.id);
    expect(userCodesValidateCode.mock.calls[0][3]).toBe('ConfirmMigratedEmail');
  });

  it('then if the code is not validated an error is returned', async () => {
    userCodesValidateCode.mockReset().mockReturnValue(null);

    await postConfirmMigratedEmail(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][1].validationFailed).toBe(true);
  });

  it('then the user is redirected to the create password view when the request is valid', async () => {
    await postConfirmMigratedEmail(req, res);

    expect(res.redirect.mock.calls).toHaveLength(1);
    expect(res.redirect.mock.calls[0][0]).toBe(`/${req.params.uuid}/migration/${expectedUserCodeId}/new-password`);
  });

  it('then the user code is stored in the session if valid', async () => {
    await postConfirmMigratedEmail(req, res);

    expect(req.session.userCode).toBe(expectedCode);
  });
});
