jest.mock('request-promise');
jest.mock('login.dfe.jwt-strategies');
jest.mock('../../src/infrastructure/Config');

describe('When authenticating a user with the api', () => {
  const username = 'user.one@unit.tests';
  const password = 'mary-had-a-little-lamb';
  const client = {
    params: {
      directoryId: 'directory1',
    },
  };
  const bearerToken = 'some-token';
  
  let rp;
  let jwtGetBearerToken;

  let directoriesApiUserAdapter;

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

    directoriesApiUserAdapter = require('./../../src/infrastructure/Users/DirectoriesApiUserAdapter');

  });

  it('it should post to the clients directory', async () => {
    await directoriesApiUserAdapter.authenticate(username, password, client);

    expect(rp.mock.calls[0][0].method).toBe('POST');
    expect(rp.mock.calls[0][0].uri).toBe('https://directories.login.dfe.test/directory1/user/authenticate');
  });

  it('it should send entered username and password', async () => {
    await directoriesApiUserAdapter.authenticate(username, password, client);

    expect(rp.mock.calls[0][0].body.username).toBe(username);
    expect(rp.mock.calls[0][0].body.password).toBe(password);
  });

  it('it should user the jwt token for authorization', async () => {
    await directoriesApiUserAdapter.authenticate(username, password, client);

    expect(rp.mock.calls[0][0].headers.authorization).toBe(`bearer ${bearerToken}`);
  });

  it('then it should throw an error if the api call failed', async () => {
    rp.mockImplementation(() => {
      const error = new Error();
      error.statusCode = 500;
      throw error;
    });

    try{
      await directoriesApiUserAdapter.authenticate(username, password, client);
      throw new Error('No error thrown!');
    }
    catch (e) {
      if(e.message==='No error thrown!') {
        throw e;
      }
    }
  });

  describe('with valid credentials', () => {
    it('then it should return the user id', async () => {
      const userId = await directoriesApiUserAdapter.authenticate(username, password, client);

      expect(userId).not.toBeNull();
      expect(userId.id).toBe('user1');
    });
  });

  describe('with invalid credentials', () => {
    beforeEach(() => {
      rp.mockImplementation(() => {
        const error = new Error();
        error.statusCode = 401;
        throw error;
      });
    });

    it('then it should return null', async () => {
      const userId = await directoriesApiUserAdapter.authenticate(username, password, client);

      expect(userId).toBeNull();
    });
  });
});
