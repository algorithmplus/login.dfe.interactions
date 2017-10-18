const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const postRequestPasswordReset = require('../../src/app/ResetPassword/postRequestPasswordReset');

const req = {
  csrfToken: () => 'token',
};
const res = {
  render: (view, model) => {
  },
};

describe('when handling the posting of a password reset request', () => {
  beforeEach(() => {
    sinon.spy(res, 'render');
  });
  afterEach(() => {
    res.render.restore();
  });

  describe('and the details are valid', () => {
    beforeEach(() => {
      req.body = {
        email: 'user.one@unit.tests',
      };
      req.query = {
        clientid: 'client1',
      };
    });
    it('then the client is retrieved from the hotconfig adapter', async () => {
      let expectedClientReceived = false;

      const postRequestPasswordResetProxy = proxyquire('../../src/app/ResetPassword/postRequestPasswordReset', {
        './../../Clients': {
          get(client) {
            if (client === 'client1') {
              expectedClientReceived = true;
            }
          },
        },
        './../../UserCodes':{ upsertCode() { } },
        './../../Users': { find() {return { sub: '12345' };} },
      });

      await postRequestPasswordResetProxy(req,res);

      expect(res.render.getCall(0).args[0]).to.equal('ResetPassword/views/codesent');
      expect(expectedClientReceived).to.equal(true);
    });
    it('then the user is retrieved from the directories api', async () => {
      let expectedEmailReceived = false;

      const postRequestPasswordResetProxy = proxyquire('../../src/app/ResetPassword/postRequestPasswordReset', {
        './../../Clients': {
          get() { },
        },
        './../../UserCodes':{ upsertCode() {  } },
        './../../Users': { find(email) { if (email === 'user.one@unit.tests') { expectedEmailReceived = true; }; return { sub: '12345' };} },
      });

      await postRequestPasswordResetProxy(req,res);

      expect(res.render.getCall(0).args[0]).to.equal('ResetPassword/views/codesent');
      expect(expectedEmailReceived).to.equal(true);
    });
    it('then a user code is requested for that user id', async ()=> {
      let expectedUidReceived = false;

      const postRequestPasswordResetProxy = proxyquire('../../src/app/ResetPassword/postRequestPasswordReset', {
        './../../Clients': {
          get() { },
        },
        './../../UserCodes':{ upsertCode(id) { if (id === '12345') {expectedUidReceived = true; } } },
        './../../Users': { find() { return { sub: '12345' };} },
      });

      await postRequestPasswordResetProxy(req,res);

      expect(res.render.getCall(0).args[0]).to.equal('ResetPassword/views/codesent');
      expect(expectedUidReceived).to.equal(true);
    });
    it('then it should render the codesent view', async () => {
      const postRequestPasswordResetProxy = proxyquire('../../src/app/ResetPassword/postRequestPasswordReset', {
        './../../Clients': {
          get() { },
        },
        './../../UserCodes':{ upsertCode() {  } },
        './../../Users': { find() { return { sub: '12345' };} },
      });

      await postRequestPasswordResetProxy(req,res);

      expect(res.render.getCall(0).args[0]).to.equal('ResetPassword/views/codesent');
    });
  });

  describe('and the details are missing', () => {
    beforeEach(() => {
      req.body = {
        email: '',
      };
    });

    it('then it should render the request view',async () => {
      await postRequestPasswordReset(req, res);

      expect(res.render.getCall(0).args[0]).to.equal('ResetPassword/views/request');
    });

    it('then it should include the csrf token on the model', async () => {
      await postRequestPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].csrfToken).to.equal('token');
    });

    it('then it should be a validation failure', async () => {
      await postRequestPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].validationFailed).to.equal(true);
    });

    it('then it should include a validation message',async () => {
      await postRequestPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].validationMessages.email).to.equal('Please enter a valid email address');
    });
  });

  describe('and the details are invalid', () => {
    beforeEach(() => {
      req.body = {
        email: 'not-a-valid-email-address',
      };
    });

    it('then it should render the request view', async () => {
      await postRequestPasswordReset(req, res);

      expect(res.render.getCall(0).args[0]).to.equal('ResetPassword/views/request');
    });

    it('then it should include the csrf token on the model', async () => {
      await postRequestPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].csrfToken).to.equal('token');
    });

    it('then it should include the posted email', async () => {
      await postRequestPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].email).to.equal('not-a-valid-email-address');
    });

    it('then it should be a validation failure', async () => {
      await postRequestPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].validationFailed).to.equal(true);
    });

    it('then it should include a validation message', async () => {
      await postRequestPasswordReset(req, res);

      expect(res.render.getCall(0).args[1].validationMessages.email).to.equal('Please enter a valid email address');
    });
  });
});
