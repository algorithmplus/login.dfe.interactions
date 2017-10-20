const proxyquire = require('proxyquire');
const { expect } = require('chai');

describe('When changing password for a user with the api', () => {
  const uid = 'user1';
  const password = 'password';
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

    const DirectoriesApiUserAdapter = proxyquire('./../../src/infrastructure/Users/DirectoriesApiUserAdapter', {
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
      '../Config': function() {
        return {
          directories: {
            service: {
              url: 'https://directories.login.dfe.test',
            },
          },
        }
      },
    });
    adapter = new DirectoriesApiUserAdapter();
  });

  it('then it should set users password in directories api', async () => {
    await adapter.changePassword(uid, password, client);

    expect(rpOpts.uri).to.equal('https://directories.login.dfe.test/directory1/user/user1/changepassword');
  });

  it('then it should jwt as auth for api call', async () => {
    await adapter.changePassword(uid, password, client);

    expect(rpOpts.headers.authorization).to.equal(`bearer ${bearerToken}`);
  });

  it('then it should send new password in body', async () => {
    await adapter.changePassword(uid, password, client);

    expect(rpOpts.body.password).to.equal(password);
  });

  it('then it should throw error if api call fails', async () => {
    rpAction = () => {
      throw new Error('unit test');
    };

    try{
      await adapter.changePassword(uid, password, client);
      expect.fail(null, null, 'didnt throw an error');
    }
    catch(e){
      expect(e.message).to.equal('Error: unit test');
    }
  })

});