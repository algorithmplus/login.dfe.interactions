const clients = [
  {
    client_id: 'client1',
    client_secret: 'some-secure-secret',
    redirect_uris: [
      'https://client.one/auth/cb',
      'https://client.one/register/complete',
    ],
    post_logout_redirect_uris: [
      'https://client.one/signout/complete',
    ],
  },
];

const getServiceById = async (id) => {
  return Promise.resolve(clients.find(c => c.client_id.toLowerCase() === id.toLowerCase()));
};

const getPageOfBanners = async (id, pageSize, page, correlationId) => {
  return Promise.resolve({
    banners: {
      id: 'bannerId',
      serviceId: 'serviceId',
      name: 'banner name',
      title: 'banner title',
      message: 'banner message',
    },
    page,
    totalNumberOfPages: 1,
    totalNumberOfRecords: 1,
  });
};

const listAllBannersForService = async (id, correlationId) => {
  return (await getPageOfBanners(id, 25, 1, correlationId).banners.find(x => x.id === id));
};

module.exports = {
  getServiceById,
  listAllBannersForService,
};
