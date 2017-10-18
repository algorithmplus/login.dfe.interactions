const proxyquire = require('proxyquire');
const { expect } = require('chai');

describe('When validating a reset code through the api', () => {
  let adapter;
  let bearerToken;
  let rpAction;

  let rpOpts;

  beforeEach(() => {
    bearerToken = 'some-token';
    rpAction = function () {
      return 'user1';
    };
    rpOpts = null;

    const DirectoriesApiUserAdapter = proxyquire('./../../src/UserCodes/UserCodesApiAdapter', {
      'request-promise': function (opts) {
        rpOpts = opts;
        return rpAction();
      },
      'login.dfe.jwt-strategies': function (config) {
        return {
          getBearerToken() {
            return bearerToken;
          },
        };
      },
      './../Config': {
        directories: {
          service: {
            url: 'https://directories.login.dfe.test',
          },
        },
      },
    });
    adapter = new DirectoriesApiUserAdapter();
  });
  it('then the user codes api endpoint is called', async () => {
    const userId = 'user1@test.com';
    const code = 'ABC123'

    await adapter.validateCode(userId, code);

    expect(rpOpts.method).to.equal('GET');
    expect(rpOpts.uri).to.equal(`https://directories.login.dfe.test/userCodes/validate/${userId}/${code}`);
  });
  it('then the code is returned if the response is valid', () => {

  });
  it('then null is returned if a 404 is received', () => {

  });
});