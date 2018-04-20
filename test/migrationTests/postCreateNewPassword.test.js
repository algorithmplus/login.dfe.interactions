jest.mock('./../../src/infrastructure/UserCodes');
jest.mock('./../../src/infrastructure/Users');
jest.mock('./../../src/infrastructure/Services');
jest.mock('./../../src/infrastructure/Config', () => jest.fn().mockImplementation(() => ({
  hostingEnvironment: {
    agentKeepAlive: {},
  },
})));
jest.mock('./../../src/infrastructure/logger', () => ({
  info: jest.fn(),
  audit: jest.fn(),
  warn: jest.fn(),
}));
const utils = require('./../utils');
const postCreateNewPassword = require('./../../src/app/migration/postCreateNewPassword');

describe('When posting to create a user from migration', () => {
  let req;
  let res;
  let userCodesGetCode;
  let userCodesDeleteCode;
  let createUser;
  let findUser;
  let createOrg;
  const expectedUserCodeId = 'some-uid';
  const expectedPassword = 'my-super-strong-password-for-test';
  const expectedEmail = 'test@local';
  const expectedUserId = 'user-1';

  beforeEach(() => {
    req = utils.mockRequest();
    res = utils.mockResponse();

    req.body = {
      newPassword: expectedPassword,
      confirmPassword: expectedPassword,
      emailConfId: expectedUserCodeId,
    };

    userCodesDeleteCode = jest.fn();
    userCodesGetCode = jest.fn().mockReset().mockReturnValue({ userCode: { email: expectedEmail, code: '', contextData: '{"firstName":"Roger","lastName":"Johnson","email":"foo3@example.com","organisation":{"id":"72711ff9-2da1-4135-8a20-3de1fea31073","name":"Some School - MAT","urn":null,"localAuthority":null,"type":"010","uid":"MAT1234"},"clientName":"Some very friendly client","clientId":"profiles","redirectUri":"https://localhost:4431","serviceId":"svc1", "userName":"old_user_name"}', redirectUri: 'https://localhost:4431' } });
    const userCodes = require('./../../src/infrastructure/UserCodes');
    userCodes.getCode = userCodesGetCode;
    userCodes.deleteCode = userCodesDeleteCode;

    createUser = jest.fn().mockReset().mockReturnValue({ id: expectedUserId });
    findUser = jest.fn().mockReset().mockReturnValue({ sub: expectedUserId });
    const users = require('./../../src/infrastructure/Users');
    users.create = createUser;
    users.find = findUser;

    createOrg = jest.fn().mockReset().mockReturnValue(true);
    const services = require('./../../src/infrastructure/Services');
    services.create = createOrg;
  });

  it('then if the password is empty an error is returned', async () => {
    req.body.newPassword = '';

    await postCreateNewPassword(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][1].validationFailed).toBe(true);
  });

  it('then if the confirm password does not match the password an error is returned', async () => {
    req.body.newPassword = 'my-super-strong-password';
    req.body.confirmPassword = 'my-super-strong-password-1';

    await postCreateNewPassword(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][1].validationFailed).toBe(true);
  });

  it('then the code is checked against the API', async () => {
    await postCreateNewPassword(req, res);

    expect(userCodesGetCode.mock.calls).toHaveLength(1);
    expect(userCodesGetCode.mock.calls[0][0]).toBe(expectedUserCodeId);
    expect(userCodesGetCode.mock.calls[0][1]).toBe(req.id);
    expect(userCodesGetCode.mock.calls[0][2]).toBe('ConfirmMigratedEmail');
  });

  it('then if no data is returned from the code API then an error is returned', async () => {
    userCodesGetCode.mockReset().mockReturnValue(null);

    await postCreateNewPassword(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][1].validationFailed).toBe(true);
  });

  it('then the user is created if the request is valid', async () => {
    await postCreateNewPassword(req, res);

    expect(createUser.mock.calls).toHaveLength(1);
    expect(createUser.mock.calls[0][0]).toBe(expectedEmail);
    expect(createUser.mock.calls[0][1]).toBe(expectedPassword);
    expect(createUser.mock.calls[0][2]).toBe('Roger');
    expect(createUser.mock.calls[0][3]).toBe('Johnson');
    expect(createUser.mock.calls[0][4]).toBe('old_user_name');
    expect(createUser.mock.calls[0][5]).toBe(req.id);
  });

  it('then if an error is returned while creating the user an error is returned', async () => {
    createUser.mockReset().mockReturnValue(null);

    await postCreateNewPassword(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][1].validationFailed).toBe(true);
  });

  it('then the user is mapped to the organisation', async () => {
    await postCreateNewPassword(req, res);

    expect(createOrg.mock.calls).toHaveLength(1);
    expect(createOrg.mock.calls[0][0]).toBe(expectedUserId);
    expect(createOrg.mock.calls[0][1]).toBe('svc1');
    expect(createOrg.mock.calls[0][2]).toBe('MAT1234');
    expect(createOrg.mock.calls[0][3]).toBe('010');
    expect(createOrg.mock.calls[0][4]).toBe(req.id);
  });

  it('then if the user is successfully created the usercode is deleted', async () => {
    await postCreateNewPassword(req, res);

    expect(userCodesDeleteCode.mock.calls).toHaveLength(1);
    expect(userCodesDeleteCode.mock.calls[0][0]).toBe(expectedUserCodeId);
    expect(userCodesDeleteCode.mock.calls[0][1]).toBe(req.id);
    expect(userCodesDeleteCode.mock.calls[0][2]).toBe('ConfirmMigratedEmail');
  });

  it('then the usercode is deleted if the user already exists', async () => {
    createUser.mockReset().mockReturnValue(null);

    await postCreateNewPassword(req, res);

    expect(userCodesDeleteCode.mock.calls).toHaveLength(1);
  });

  it('then the user org to service assocation is still created if the user exists', async () => {
    createUser.mockReset().mockReturnValue(null);

    await postCreateNewPassword(req, res);

    expect(findUser.mock.calls).toHaveLength(1);
    expect(findUser.mock.calls[0][0]).toBe(expectedEmail);
    expect(createOrg.mock.calls).toHaveLength(1);
    expect(createOrg.mock.calls[0][0]).toBe(expectedUserId);
    expect(createOrg.mock.calls[0][1]).toBe('svc1');
    expect(createOrg.mock.calls[0][2]).toBe('MAT1234');
    expect(createOrg.mock.calls[0][3]).toBe('010');
    expect(createOrg.mock.calls[0][4]).toBe(req.id);
  });

  it('then the user is redirected to the migration complete view when the request is valid', async () => {
    await postCreateNewPassword(req, res);

    expect(res.redirect.mock.calls).toHaveLength(1);
    expect(res.redirect.mock.calls[0][0]).toBe(`/${req.params.uuid}/migration/complete`);
  });
});
