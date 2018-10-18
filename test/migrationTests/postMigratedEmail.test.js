jest.mock('./../../src/infrastructure/UserCodes');
jest.mock('./../../src/infrastructure/Users');
jest.mock('./../../src/infrastructure/Config', () => jest.fn().mockImplementation(() => ({
  hostingEnvironment: {
    agentKeepAlive: {},
  },
})));

const utils = require('./../utils');
const getRequestPasswordReset = require('./../../src/app/migration/postMigratedEmail');

describe('When posting to confirm the migration email view', () => {
  let req;
  let res;
  let upsertCodeStub;
  const expectedViewToDisplay = 'no-email';
  const expectedEmail = 'test@tester.local';
  const expectedClientId = 'test-client-1';
  const expectedRedirectUri = 'https://local.test';
  const expectedUserCodeId = 'some-uid';

  beforeEach(() => {
    req = utils.mockRequest();
    res = utils.mockResponse();

    req.body = {
      viewToDisplay: expectedViewToDisplay,
      email: expectedEmail,
    };

    req.migrationUser = {
      clientId: expectedClientId,
      redirectUri: expectedRedirectUri,
      clientName: 'TestClient',
      firstName: 'Test',
      lastName: 'Tester',
    };

    upsertCodeStub = jest.fn().mockReturnValue({ code: '', uid: expectedUserCodeId });
    const userCodes = require('./../../src/infrastructure/UserCodes');
    userCodes.upsertCode = upsertCodeStub;
  });

  it('then if the email is not valid an error is returned and the view from the body displayed', async () => {
    req.body.email = '';

    await getRequestPasswordReset(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe(expectedViewToDisplay);
    expect(res.render.mock.calls[0][1].validationFailed).toBe(true);
  });

  it('then if it is selected to use existing email then it is validated', async () => {
    req.body.radioEmailGroup = 'Yes';
    req.migrationUser.email = 'asd';

    await getRequestPasswordReset(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe(expectedViewToDisplay);
    expect(res.render.mock.calls[0][1].validationFailed).toBe(true);
    expect(res.render.mock.calls[0][1].user.email).toBe('asd');
  });

  it('then if the email is valid then the code is requested', async () => {
    await getRequestPasswordReset(req, res);

    expect(upsertCodeStub.mock.calls).toHaveLength(1);
    expect(upsertCodeStub.mock.calls[0][0]).toBe(undefined);
    expect(upsertCodeStub.mock.calls[0][1]).toBe(expectedClientId);
    expect(upsertCodeStub.mock.calls[0][2]).toBe(expectedRedirectUri);
    expect(upsertCodeStub.mock.calls[0][3]).toBe('123');
    expect(upsertCodeStub.mock.calls[0][4]).toBe('ConfirmMigratedEmail');
    expect(upsertCodeStub.mock.calls[0][5]).toBe(expectedEmail);
    expect(upsertCodeStub.mock.calls[0][6]).toMatchObject(req .migrationUser);
  });

  it('then the confirm email view is displayed when the request is valid and the code uid passed to the view', async () => {
    await getRequestPasswordReset(req, res);

    expect(res.redirect.mock.calls).toHaveLength(1);
    expect(res.redirect.mock.calls[0][0]).toBe(`/${req.params.uuid}/migration/${expectedUserCodeId}/confirm-email`);
  });
});
