const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const postConfirmPasswordReset = require('../../src/app/ResetPassword/postConfirmPasswordReset');

const req = {
  params: {
    uuid: '123-abc',
  },
  session: {

  },
  csrfToken: () => 'token',
};
const res = {
  render: (view, model) => {},
  redirect: (url) => {},
};

describe('When posting the confirm password reset view', () => {
  beforeEach(() => {
    sinon.spy(res, 'render');
    sinon.spy(res, 'redirect');
  });
  afterEach(() => {
    res.render.restore();
    res.redirect.restore();
  });

  describe('and the details are valid', () => {
    beforeEach(() => {
      req.body = {
        email: 'user.one@unit.test',
        code: '123456',
      };
      req.query = {
        clientid: 'client1',
      };
    });
    it('then the client is retrieved from the hotconfig adapter', async () => {
      let expectedClientReceived = false;

      const postConfirmPasswordResetProxy = proxyquire('../../src/app/ResetPassword/postConfirmPasswordReset', {
        './../../Clients': {
          get(client) {
            if (client === 'client1') {
              expectedClientReceived = true;
            }
          },
        },
        './../../UserCodes': { validateCode() { return { code: '' }; } },
        './../../Users': { find() { return { sub: '12345' }; } },
      });

      await postConfirmPasswordResetProxy(req, res);

      expect(expectedClientReceived).to.equal(true);
    });
    it('then the user is retrieved from the directories api', async () => {
      let expectedEmailReceived = false;

      const postConfirmPasswordResetProxy = proxyquire('../../src/app/ResetPassword/postConfirmPasswordReset', {
        './../../Clients': {
          get() { },
        },
        './../../UserCodes': { validateCode() { return { code: '' }; } },
        './../../Users': { find(email) { if (email === 'user.one@unit.test') { expectedEmailReceived = true; } return { sub: '12345' }; } },
      });

      await postConfirmPasswordResetProxy(req, res);

      expect(expectedEmailReceived).to.equal(true);
    });
    it('then a user code is validated for that user id', async () => {
      let expectedUidReceived = false;
      let expectedCodeReceived = false;

      const postConfirmPasswordResetProxy = proxyquire('../../src/app/ResetPassword/postConfirmPasswordReset', {
        './../../Clients': {
          get() { },
        },
        './../../UserCodes': {
          validateCode(userId, code) {
            if (userId === '12345EDC') {
              expectedUidReceived = true;
            }
            if (code === '123456') {
              expectedCodeReceived = true;
            }
            return { code: '' };
          },
        },
        './../../Users': { find() { return { sub: '12345EDC' }; } },
      });

      await postConfirmPasswordResetProxy(req, res);

      expect(expectedUidReceived).to.equal(true);
      expect(expectedCodeReceived).to.equal(true);
    });
    it('then it should redirect to newpassword view', async () => {
      const postConfirmPasswordResetProxy = proxyquire('../../src/app/ResetPassword/postConfirmPasswordReset', {
        './../../Clients': { get() { } },
        './../../UserCodes': { validateCode() { return { code: '' }; } },
        './../../Users': { find() { return { sub: '12345' }; } },
      });

      await postConfirmPasswordResetProxy(req, res);

      expect(res.redirect.getCall(0).args[0]).to.equal('/123-abc/resetpassword/newpassword');
    });
  });

  describe('and the email is missing', () => {
    beforeEach(() => {
      req.body = {
        email: '',
        code: '123456',
      };
    });

    it('then it should render the confirm view', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.getCall(0).args[0]).to.equal('ResetPassword/views/confirm');
    });

    it('then it should include the csrf token on the model', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].csrfToken).to.equal('token');
    });

    it('then it should include the posted code', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].code).to.equal('123456');
    });

    it('then it should be a validation failure', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].validationFailed).to.equal(true);
    });

    it('then it should include a validation message for email', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].validationMessages.email).to.equal('Please enter a valid email address');
    });
  });

  describe('and the code is missing', () => {
    beforeEach(() => {
      req.body = {
        email: 'user.one@unit.test',
        code: '',
      };
    });

    it('then it should render the confirm view', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.getCall(0).args[0]).to.equal('ResetPassword/views/confirm');
    });

    it('then it should include the csrf token on the model', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].csrfToken).to.equal('token');
    });

    it('then it should include the posted email', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].email).to.equal('user.one@unit.test');
    });

    it('then it should be a validation failure', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].validationFailed).to.equal(true);
    });

    it('then it should include a validation message for code', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].validationMessages.code).to.equal('Please enter the code that was emailed to you');
    });
  });

  describe('and the email is invalid', () => {
    beforeEach(() => {
      req.body = {
        email: 'not-a-valid-email-address',
        code: '123456',
      };
    });

    it('then it should render the confirm view', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.getCall(0).args[0]).to.equal('ResetPassword/views/confirm');
    });

    it('then it should include the csrf token on the model', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].csrfToken).to.equal('token');
    });

    it('then it should include the posted email', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].email).to.equal('not-a-valid-email-address');
    });

    it('then it should include the posted code', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].code).to.equal('123456');
    });

    it('then it should be a validation failure', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].validationFailed).to.equal(true);
    });

    it('then it should include a validation message for email', async () => {
      await postConfirmPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].validationMessages.email).to.equal('Please enter a valid email address');
    });
  });
});
