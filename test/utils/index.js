const mockRequest = (customRequest = {}) => {
  return Object.assign({
    method: 'GET',
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
  }, customRequest);
};
const mockResponse = () => {
  return {
    render: jest.fn(),
    redirect: jest.fn(),
    status: jest.fn(),
    mockResetAll: function () {
      this.render.mockReset().mockReturnValue(this);
      this.redirect.mockReset().mockReturnValue(this);
      this.status.mockReset().mockReturnValue(this);
      return this;
    },
  };
};

module.exports = {
  mockRequest,
  mockResponse,
};