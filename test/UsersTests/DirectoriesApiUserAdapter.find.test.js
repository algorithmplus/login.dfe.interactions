const proxyquire = require('proxyquire');
const { expect } = require('chai');

describe('When finding a user with the api', () => {
  const username = 'user.one@unit.tests';

  const client = {
    params: {
      directoryId: 'directory1',
    },
  };

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

    const DirectoriesApiUserAdapter = proxyquire('./../../src/Users/DirectoriesApiUserAdapter', {
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
  it('it calls the clients directory at the user endpoint with the user identifier', async () => {
    await adapter.find(username, client);

    expect(rpOpts.method).to.equal('GET');
    expect(rpOpts.uri).to.equal(`https://directories.login.dfe.test/directory1/user/${username}`);
  });
});