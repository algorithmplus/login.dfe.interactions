const proxyquire = require('proxyquire');
const { expect } = require('chai');

describe('When upserting a reset code through the api', () => {
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
    const userId = '1234EDCFR';

    await adapter.upsertCode(userId);

    expect(rpOpts.method).to.equal('PUT');
    expect(rpOpts.uri).to.equal('https://directories.login.dfe.test/userCodes/upsert');
  });
  it('then the user id is passed in the body', async () => {
    const userId = '1234EDCFR';

    await adapter.upsertCode(userId);

    expect(rpOpts.body.uid).to.equal(userId);
  });
});