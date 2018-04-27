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

  it('then if there is no urn for org_type 001 then a warning is shown', async () => {
    req.session.migrationUser.organisation.type = '001';
    req.session.migrationUser.organisation.urn = '';

    await getMigratedUserDetails(req, res);

    expect(getOrganisationByExternalIdStub.mock.calls).toHaveLength(0);
    expect(res.render.mock.calls[0][1].failedValidation).toBe(true);
  });

  it('then if there is no uid for org_type 010 then a warning is shown', async () => {
    req.session.migrationUser.organisation.type = '010';
    req.session.migrationUser.organisation.uid = '';

    await getMigratedUserDetails(req, res);

    expect(getOrganisationByExternalIdStub.mock.calls).toHaveLength(0);
    expect(res.render.mock.calls[0][1].failedValidation).toBe(true);
  });

  it('then if there is no uid for org_type 013 then a warning is shown', async () => {
    req.session.migrationUser.organisation.type = '013';
    req.session.migrationUser.organisation.uid = '';

    await getMigratedUserDetails(req, res);

    expect(getOrganisationByExternalIdStub.mock.calls).toHaveLength(0);
    expect(res.render.mock.calls[0][1].failedValidation).toBe(true);
  });

  it('then if the org_type is not recognised a warning is shown', async () => {
    req.session.migrationUser.organisation.type = '002';

    await getMigratedUserDetails(req, res);

    expect(getOrganisationByExternalIdStub.mock.calls).toHaveLength(0);
    expect(res.render.mock.calls[0][1].failedValidation).toBe(true);
  });


  it('then the org is checked against the api to see if it exists for org type 001', async () => {
    req.session.migrationUser.organisation.type = '001';
    req.session.migrationUser.organisation.urn = '123';

    await getMigratedUserDetails(req, res);

    expect(getOrganisationByExternalIdStub.mock.calls).toHaveLength(1);
    expect(getOrganisationByExternalIdStub.mock.calls[0][0]).toBe('123');
    expect(getOrganisationByExternalIdStub.mock.calls[0][1]).toBe('001');
    expect(res.render.mock.calls[0][1].failedValidation).toBe(false);
  });

  it('then the org is checked against the api to see if it exists for org type 010', async () => {
    req.session.migrationUser.organisation.type = '010';
    req.session.migrationUser.organisation.uid = '321';

    await getMigratedUserDetails(req, res);

    expect(getOrganisationByExternalIdStub.mock.calls).toHaveLength(1);
    expect(getOrganisationByExternalIdStub.mock.calls[0][0]).toBe('321');
    expect(getOrganisationByExternalIdStub.mock.calls[0][1]).toBe('010');
    expect(res.render.mock.calls[0][1].failedValidation).toBe(false);
  });

  it('then the org is checked against the api to see if it exists for org type 013', async () => {
    req.session.migrationUser.organisation.type = '013';
    req.session.migrationUser.organisation.uid = '456';

    await getMigratedUserDetails(req, res);

    expect(getOrganisationByExternalIdStub.mock.calls).toHaveLength(1);
    expect(getOrganisationByExternalIdStub.mock.calls[0][0]).toBe('456');
    expect(getOrganisationByExternalIdStub.mock.calls[0][1]).toBe('013');
    expect(res.render.mock.calls[0][1].failedValidation).toBe(false);
  });

  it('then if the org does not exist an error is returned', async () => {
    getOrganisationByExternalIdStub.mockReset().mockReturnValue(null);

    await getMigratedUserDetails(req, res);

    expect(getOrganisationByExternalIdStub.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][1].failedValidation).toBe(true);
  });
});
