jest.mock('request-promise');
jest.mock('login.dfe.jwt-strategies');
jest.mock('../../src/infrastructure/Config');

describe('When validating a reset code through the api', () => {
  let rp;
  let jwtGetBearerToken;

  let adapter;

  beforeEach(() => {
    rp = require('request-promise');
    rp.mockReturnValue('ABC123');

    jwtGetBearerToken = jest.fn().mockReturnValue('some-token');
    const jwt = require('login.dfe.jwt-strategies');
    jwt.mockImplementation((jwtConfig) => {
      return {
        getBearerToken: jwtGetBearerToken
      };
    });

    const config = require('./../../src/infrastructure/Config');
    config.mockImplementation(() => {
      return {
        directories: {
          service: {
            url: 'https://directories.login.dfe.test',
          },
        },
      }
    });

    const DirectoriesApiUserAdapter = require('./../../src/infrastructure/UserCodes/UserCodesApiAdapter');
    adapter = new DirectoriesApiUserAdapter();
  });

  it('then the user codes api endpoint is called', async () => {
    const userId = 'user1@test.com';
    const code = 'ABC123';
    rp.mockReturnValue(code);

    await adapter.validateCode(userId, code);

    expect(rp.mock.calls.length).toBe(1);
    expect(rp.mock.calls[0][0].method).toBe('GET');
    expect(rp.mock.calls[0][0].uri).toBe(`https://directories.login.dfe.test/userCodes/validate/${userId}/${code}`);
  });

  it('then the code is returned if the response is valid', async () => {
    const userId = 'user1@test.com';
    const code = 'ABC123';
    rp.mockReturnValue(code);

    const actual = await adapter.validateCode(userId, code);

    expect(actual).not.toBeNull();
    expect(actual.userCode).toBe(code);
  });

  it('then null is returned if a 404 is received', async () => {
    rp.mockImplementation(() => {
      const error = new Error();
      error.statusCode = 404;
      throw error;
    });

    const actual = await adapter.validateCode('user', 'code');

    expect(actual).toBeNull();
  });

});