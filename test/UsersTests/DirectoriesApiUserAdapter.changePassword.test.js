jest.mock('request-promise');
jest.mock('login.dfe.jwt-strategies');
jest.mock('../../src/infrastructure/Config');

describe('When changing password for a user with the api', () => {
  const uid = 'user1';
  const password = 'password';
  const client = {
    params: {
      directoryId: 'directory1',
    },
  };
  const bearerToken = 'some-token';

  let rp;
  let jwtGetBearerToken;

  let adapter;

  beforeEach(() => {
    rp = require('request-promise');
    rp.mockReturnValue('user1');

    jwtGetBearerToken = jest.fn().mockReturnValue(bearerToken);
    const jwt = require('login.dfe.jwt-strategies');
    jwt.mockImplementation((jwtConfig) => {
      return {
        getBearerToken: jwtGetBearerToken
      }
    });

    const config = require('./../../src/infrastructure/Config');
    config.mockImplementation(() =>{
      return {
        directories: {
          service: {
            url: 'https://directories.login.dfe.test',
          },
        },
      };
    });

    const DirectoriesApiUserAdapter = require('./../../src/infrastructure/Users/DirectoriesApiUserAdapter');
    adapter = new DirectoriesApiUserAdapter();
  });

  it('then it should set users password in directories api', async () => {
    await adapter.changePassword(uid, password, client);

    expect(rp.mock.calls[0][0].uri).toBe('https://directories.login.dfe.test/directory1/user/user1/changepassword');
  });

  it('then it should jwt as auth for api call', async () => {
    await adapter.changePassword(uid, password, client);

    expect(rp.mock.calls[0][0].headers.authorization).toBe(`bearer ${bearerToken}`);
  });

  it('then it should send new password in body', async () => {
    await adapter.changePassword(uid, password, client);

    expect(rp.mock.calls[0][0].body.password).toBe(password);
  });

  it('then it should throw error if api call fails', async () => {
    rp.mockImplementation(() => {
      throw new Error('unit test');
    });

    try{
      await adapter.changePassword(uid, password, client);
      throw new Error('didnt throw an error');
    }
    catch(e){
      expect(e.message).toBe('Error: unit test');
    }
  })

});