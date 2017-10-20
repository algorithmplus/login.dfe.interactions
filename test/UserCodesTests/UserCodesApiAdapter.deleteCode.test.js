jest.mock('request-promise');
jest.mock('login.dfe.jwt-strategies');
jest.mock('../../src/infrastructure/Config');

describe('When deleting a reset code through the api', () => {
  let rp;
  let jwtGetBearerToken;

  let adapter;

  beforeEach(() => {
    rp = require('request-promise');
    rp.mockReturnValue('user1');

    jwtGetBearerToken = jest.fn().mockReturnValue('some-token');
    const jwt = require('login.dfe.jwt-strategies');
    jwt.mockImplementation((jwtConfig) => {
      return {
        getBearerToken: jwtGetBearerToken
      };
    });

    const config = require('../../src/infrastructure/Config');
    config.mockImplementation(() => {
      return {
        directories: {
          service: {
            url: 'https://directories.login.dfe.test',
          },
        },
      }
    });

    const DirectoriesApiUserAdapter = require('../../src/infrastructure/UserCodes/UserCodesApiAdapter')
    adapter = new DirectoriesApiUserAdapter();
  });

  it('then the user codes api endpoint is called', async () => {
    const userId = 'user1@test.com';

    await adapter.deleteCode(userId);

    expect(rp.mock.calls.length).toBe(1);
    expect(rp.mock.calls[0][0].method).toBe('DELETE');
    expect(rp.mock.calls[0][0].uri).toBe(`https://directories.login.dfe.test/userCodes/${userId}`);
  });
});