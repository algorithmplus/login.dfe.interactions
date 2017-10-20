jest.mock('request-promise');
jest.mock('login.dfe.jwt-strategies');
jest.mock('../../src/infrastructure/Config');

describe('When upserting a reset code through the api', () => {
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

    const DirectoriesApiUserAdapter = require('../../src/infrastructure/UserCodes/UserCodesApiAdapter');
    adapter = new DirectoriesApiUserAdapter();
  });

  it('then the user codes api endpoint is called', async () => {
    const userId = '1234EDCFR';
    rp.mockReturnValue(userId);

    await adapter.upsertCode(userId);

    expect(rp.mock.calls.length).toBe(1);
    expect(rp.mock.calls[0][0].method).toBe('PUT');
    expect(rp.mock.calls[0][0].uri).toBe(`https://directories.login.dfe.test/userCodes/upsert`);
  });
  it('then the user id is passed in the body', async () => {
    const userId = '1234EDCFR';
    rp.mockReturnValue(userId);

    await adapter.upsertCode(userId);

    expect(rp.mock.calls[0][0].body.uid).toBe(userId);
  });
});