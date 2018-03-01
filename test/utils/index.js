const mockRequest = () => {
  return {
    accepts: () => {
      return ['text/html'];
    },
    id: '123',
    params: {
      uuid: '123-abc',
      uid: '123-abc',
    },
    session: {},
    body: {},
    query: {},
    csrfToken: jest.fn().mockReturnValue('token'),
  };
};
const mockResponse = () => {
  return {
    render: jest.fn(),
    redirect: jest.fn(),
  };
};

module.exports = {
  mockRequest,
  mockResponse,
};