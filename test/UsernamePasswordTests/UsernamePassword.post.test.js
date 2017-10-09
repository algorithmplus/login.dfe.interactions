// const usernamePassword = require('./../../src/UsernamePassword/postUsernamePassword');

const expect = require('chai').expect;
const proxyquire = require('proxyquire');

const req = {
  query: {
    clientid: 'test',
  },
  body: {
    username: 'TonyStark',
    password: 'IAmIronman!',
  },
  params: {
    uuid: 'some-uuid',
  },
  csrfToken: () => 'my-secure-token',
};

let renderViewPath;
let renderModel;
const res = {
  render(viewPath, model) {
    renderViewPath = viewPath;
    renderModel = model;
  },
};

let user = null;
const userService = {
  authenticate(username, password, client) {
    return user;
  },
};

let completeUuid;
let completeData;
const interactionComplete = {
  process(uuid, data, res) {
    completeUuid = uuid;
    completeData = data;
  },
};

let client = {
  client_id: 'test',
};
const clients = {
  get(clientId) {
    return Promise.resolve(client);
  },
};

describe('When user submits username/password', () => {
  let postHandler;

  beforeEach(() => {
    postHandler = proxyquire('./../../src/UsernamePassword/postUsernamePassword', {
      './../InteractionComplete': interactionComplete,
      './../Users': userService,
      './../Clients': clients,
    });
  });

  describe('with a invalid username/password', () => {
    beforeEach(() => {
      user = null;
    });

    it('then it should render usernamepassword view', async () => {
      await postHandler(req, res);

      expect(renderViewPath).to.equal('usernamepassword/index');
    });

    it('then it should be a failed login', async () => {
      await postHandler(req, res);

      expect(renderModel.isFailedLogin).to.equal(true);
      expect(renderModel.message).to.equal('Invalid email address or password. Try again.');
    });

    it('then it should include the csrf token', async () => {
      await postHandler(req, res);

      expect(renderModel.csrfToken).to.equal('my-secure-token');
    });
  });

  describe('with a valid username/password', () => {
    beforeEach(() => {
      user = {
        id: 'user1',
      };
    });

    it('then it should process interaction complete for uuid', async () => {
      await postHandler(req, res);

      expect(completeUuid).to.equal('some-uuid');
    });

    it('then it should process interaction complete for userid', async () => {
      await postHandler(req, res);

      expect(completeData).to.not.be.null;
      expect(completeData.uid).to.equal('user1');
    });

    it('then it should return success', async () => {
      await postHandler(req, res);

      expect(completeData).to.not.be.null;
      expect(completeData.status).to.equal('success');
    });
  });

  describe('with an invalid client id', () => {
    beforeEach(() => {
      client = null;
    });

    it('then is should complete interaction', async () => {
      await postHandler(req, res);

      expect(completeUuid).to.equal('some-uuid');
    });

    it('then it should return a failure', async () => {
      await postHandler(req, res);

      expect(completeData).to.not.be.null;
      expect(completeData.status).to.equal('failed');
      expect(completeData.reason).to.equal('invalid clientid');
    });
  });
});
