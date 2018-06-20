jest.mock('./../../src/infrastructure/Organisations');
const utils = require('./../utils');
const orgApi = require('./../../src/infrastructure/Organisations');

describe('When getting the migration user details view', () => {
  let req;
  let res;
  let getOrganisationByExternalIdStub;
  let getMigratedUserDetails

  beforeEach(() => {
    req = utils.mockRequest();
    res = utils.mockResponse();

    req.session.migrationUser = {
      clientName: 'TestClient',
      firstName: 'Test',
      lastName: 'Tester',
      organisation: {
        type: '013',
        urn: '',
        uid: '123',
        localAuthority: '',
        osaId: 123,
      },
    };

    getOrganisationByExternalIdStub = jest.fn().mockReset().mockReturnValue({});
    orgApi.getOrganisationByExternalId = getOrganisationByExternalIdStub;

    getMigratedUserDetails = require('./../../src/app/migration/getMigratedUserDetails');
  });

  it('then it should render the migration user detail view', async () => {
    await getMigratedUserDetails(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('migration/views/userDetail');
  });

  it('then it should include the csrf token on the model', async () => {
    await getMigratedUserDetails(req, res);

    expect(res.render.mock.calls[0][1].csrfToken).toBe('token');
  });

  it('then it should pass the user from the session to the view', async () => {
    await getMigratedUserDetails(req, res);

    expect(res.render.mock.calls[0][1].user).toMatchObject(req.session.migrationUser);
  });

  it('then if there is no org with osaId then a warning is shown', async () => {
    getOrganisationByExternalIdStub.mockReturnValue(null);

    await getMigratedUserDetails(req, res);

    expect(getOrganisationByExternalIdStub.mock.calls).toHaveLength(1);
    expect(getOrganisationByExternalIdStub.mock.calls[0][0]).toBe(123);
    expect(getOrganisationByExternalIdStub.mock.calls[0][1]).toBe('000');
    expect(res.render.mock.calls[0][1].failedValidation).toBe(true);
  });


  it('then the org is checked against the api to see if it exists', async () => {
    await getMigratedUserDetails(req, res);

    expect(getOrganisationByExternalIdStub.mock.calls).toHaveLength(1);
    expect(getOrganisationByExternalIdStub.mock.calls[0][0]).toBe(123);
    expect(getOrganisationByExternalIdStub.mock.calls[0][1]).toBe('000');
    expect(res.render.mock.calls[0][1].failedValidation).toBe(false);
  });

  it('then if the org does not exist an error is returned', async () => {
    getOrganisationByExternalIdStub.mockReset().mockReturnValue(null);

    await getMigratedUserDetails(req, res);

    expect(getOrganisationByExternalIdStub.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][1].failedValidation).toBe(true);
  });
});
