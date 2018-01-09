const utils = require('./../utils');

const hasConfirmedIdentity = require('./../../src/app/ResetPassword/hasConfirmedIdentity');

describe('when checking password reset has confirmed identity', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = utils.mockRequest();
    res = utils.mockResponse();
    next = jest.fn();
  });

  it('then it redirects to confirm if no session.uid present', () => {
    hasConfirmedIdentity(req, res, next);

    expect(res.redirect.mock.calls).toHaveLength(1);
    expect(res.redirect.mock.calls[0][0]).toBe('confirm');
    expect(next.mock.calls).toHaveLength(0);
  });

  it('then it should call next middleware if session.uid present', () => {
    req.session.uid = 'user1';

    hasConfirmedIdentity(req, res, next);

    expect(res.redirect.mock.calls).toHaveLength(0);
    expect(next.mock.calls).toHaveLength(1);
  });
});
