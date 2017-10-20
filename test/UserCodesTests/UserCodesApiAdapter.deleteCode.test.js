const proxyquire = require('proxyquire');
const { expect } = require('chai');

describe('When deleting a reset code through the api', () => {
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

    const DirectoriesApiUserAdapter = proxyquire('../../src/infrastructure/UserCodes/UserCodesApiAdapter', {
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
      '../Config': {
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

    await adapter.deleteCode(userId);

    expect(rpOpts.method).to.equal('DELETE');
    expect(rpOpts.uri).to.equal(`https://directories.login.dfe.test/userCodes/${userId}`);
  });
});