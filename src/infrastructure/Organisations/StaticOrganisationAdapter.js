const getOrganisationByExternalId = async () => {
  return Promise.resolve({ id: '33421d3e-54ba-44ac-c453-2d42b9a05492' });
};

const setUsersRoleAtOrg = async (userId, organisationId, roleId, correlationId) => {
  return Promise.resolve(true);
};

const putSingleServiceIdentifierForUser = async (userId, serviceId, orgId, value, reqId) => {
  return Promise.resolve(true);
};

const getOrganisationById = async (id, correlationId) => {
  return Promise.resolve({ id: '33421d3e-54ba-44ac-c453-2d42b9a05492' });
};

const getPageOfOrganisationAnnouncements = async (organisationId, pageNumber, correlationId) => {
  return Promise.resolve({
    announcements: [],
    page: pageNumber,
    numberOfPages: 0,
    totalNumberOfRecords: 0,
  });
};
const associatedWithUser = async (userId, correlationId) => {
  return Promise.resolve([]);
}

const associatedWithUserV2 = async (userId, correlationId) => {
  return Promise.resolve([]);
}

module.exports = {
  getOrganisationByExternalId,
  setUsersRoleAtOrg,
  putSingleServiceIdentifierForUser,
  getOrganisationById,
  getPageOfOrganisationAnnouncements,
  associatedWithUser,
  associatedWithUserV2,
};
