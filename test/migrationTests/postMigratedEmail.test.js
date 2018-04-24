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
  let findUserStub;
  const expectedViewToDisplay = 'no-email';
  const expectedEmail = 'test@tester.local';
  const expectedClientId = 'test-client-1';
  const expectedRedirectUri = 'https://local.test';
  const expectedUserCodeId = 'some-uid';
  const expectedUserId = 'some-user-uid';

  beforeEach(() => {
    req = utils.mockRequest();
    res = utils.mockResponse();

    req.body = {
      viewToDisplay: expectedViewToDisplay,
      email: expectedEmail,
    };

    req.session.migrationUser = {
      clientId: expectedClientId,
      redirectUri: expectedRedirectUri,
      clientName: 'TestClient',
      firstName: 'Test',
      lastName: 'Tester',
    };

    upsertCodeStub = jest.fn().mockReturnValue({ code: '', uid: expectedUserCodeId });
    const userCodes = require('./../../src/infrastructure/UserCodes');
    userCodes.upsertCode = upsertCodeStub;

    findUserStub = jest.fn().mockReset().mockReturnValue(null);
    const users = require('./../../src/infrastructure/Users');
    users.find = findUserStub;
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
    req.session.migrationUser.email = 'asd';

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
    expect(upsertCodeStub.mock.calls[0][6]).toMatchObject(req.session.migrationUser);
  });

  it('then the confirm email view is displayed when the request is valid and the code uid passed to the view', async () => {
    await getRequestPasswordReset(req, res);

    expect(res.redirect.mock.calls).toHaveLength(1);
    expect(res.redirect.mock.calls[0][0]).toBe(`/${req.params.uuid}/migration/${expectedUserCodeId}/confirm-email`);
  });

  it('then the email address is checked to see if it is already registered', async () => {
    await getRequestPasswordReset(req, res);

    expect(findUserStub.mock.calls).toHaveLength(1);
    expect(findUserStub.mock.calls[0][0]).toBe(expectedEmail);
    expect(findUserStub.mock.calls[0][1]).toBe(req.id);
  });

  it('then if the email address is in use the user is redirected to the email in use page', async () => {
    findUserStub = jest.fn().mockReset().mockReturnValue({ sub: expectedUserId });
    const users = require('./../../src/infrastructure/Users');
    users.find = findUserStub;

    await getRequestPasswordReset(req, res);

    expect(res.redirect.mock.calls).toHaveLength(1);
    expect(res.redirect.mock.calls[0][0]).toBe(`/${req.params.uuid}/migration/email-in-use`);
  });
});
