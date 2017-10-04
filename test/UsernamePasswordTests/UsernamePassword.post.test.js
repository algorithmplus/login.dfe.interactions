// const usernamePassword = require('./../../src/UsernamePassword/postUsernamePassword');

const expect = require('chai').expect;
const proxyquire = require('proxyquire');

const req = {
  query: {
    clientid: 'test'
  },
  body: {
    username: 'TonyStark',
    password: 'IAmIronman!'
  },
  params: {
    uuid: 'some-uuid'
  },
  csrfToken: () => {
    return 'my-secure-token'
  }
};

let renderViewPath;
let renderModel;
const res = {
  render(viewPath, model) {
    renderViewPath = viewPath;
    renderModel = model;
  }
};

let user = null;
const userService = {
  authenticate(username, password, client) {
    return user;
  }
};

let completeUuid;
let completeData;
const interactionComplete = {
  process(uuid, data, res) {
    completeUuid = uuid;
    completeData = data;
  }
};

const clients = {
  get(clientId) {
    return Promise.resolve({
      client_id: clientId
    });
  }
};

describe('When user submits username/password', function () {
  let postHandler;

  beforeEach(function () {
    postHandler = proxyquire('./../../src/UsernamePassword/postUsernamePassword', {
      './../InteractionComplete': interactionComplete,
      './../Users': userService,
      './../Clients': clients,
    })
  });

  describe('with a invalid username/password', function () {

    beforeEach(function () {
      user = null;
    });

    it('then it should render usernamepassword view', async function () {
      await postHandler(req, res);

      expect(renderViewPath).to.equal('usernamepassword/index')
    });

    it('then it should be a failed login', async function () {
      await postHandler(req, res);

      expect(renderModel.isFailedLogin).to.equal(true);
      expect(renderModel.message).to.equal('Invalid email address or password. Try again.');
    });

    it('then it should include the csrf token', async function () {
      await postHandler(req, res);

      expect(renderModel.csrfToken).to.equal('my-secure-token');
    });

  });

  describe('with a valid username/password', function () {

    beforeEach(function() {
      user = {
        id: 'user1'
      };
    });

    it('then it should process interaction complete for uuid', async function() {
      await postHandler(req, res);

      expect(completeUuid).to.equal('some-uuid');
    });

    it('then it should process interaction complete for userid', async function() {
      await postHandler(req, res);

      expect(completeData).to.not.be.null;
      expect(completeData.uid).to.equal('user1');
    });

  })

});