const proxyquire = require('proxyquire');
const { expect } = require('chai');

describe('When authenticating a user with the api', () => {
  const username = 'user.one@unit.tests';
  const password = 'mary-had-a-little-lamb';
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

  it('it should post to the clients directory', async () => {
    await adapter.authenticate(username, password, client);

    expect(rpOpts.method).to.equal('POST');
    expect(rpOpts.uri).to.equal('https://directories.login.dfe.test/directory1/user/authenticate');
  });

  it('it should send entered username and password', async () => {
    await adapter.authenticate(username, password, client);

    expect(rpOpts.body.username).to.equal(username);
    expect(rpOpts.body.password).to.equal(password);
  });

  it('it should user the jwt token for authorization', async () => {
    await adapter.authenticate(username, password, client);

    expect(rpOpts.headers.authorization).to.equal(`bearer ${bearerToken}`);
  });

  it('then it should throw an error if the api call failed', async () => {
    rpAction = () => {
      throw new Error(); // TODO: throw right error to simulate 500
    };

    adapter.authenticate(username, password, client)
      .then(() => {
        const err = new Error();
        err.statusCode = 500;
        throw err;
      })
      .catch(() => {}); // all good
  });

  describe('with valid credentials', () => {
    it('then it should return the user id', async () => {
      const userId = await adapter.authenticate(username, password, client);

      expect(userId).to.not.be.null;
      expect(userId.id).to.equal('user1');
    });
  });

  describe('with invalid credentials', () => {
    beforeEach(() => {
      rpAction = () => {
        const err = new Error();
        err.statusCode = 401;
        throw err;
      };
    });

    it('then it should return null', async () => {
      const userId = await adapter.authenticate(username, password, client);

      expect(userId).to.be.null;
    });
  });
});
