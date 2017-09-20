const sinon = require('sinon');
const expect = require('chai').expect;
const proxyquire =  require('proxyquire');

//const UsernamePasswordRoutes = require('./../../../src/UsernamePassword/UsernamePasswordRoutes');

const req = {
  params: {
    uuid: 'd4b4a750-9de8-11e7-abc4-cec278b6b50a'
  },
  body: {
    username: 'user@unit.tests',
    password: 'secure_password'
  }
};
const res = {
  render: function(view){}
};
let authenticateValid = true;
let authenticatedUsername;
let authenticatedPassword;
const config = {
  services: {
    user: {
      authenticate: function(username, password) {
        authenticatedUsername = username;
        authenticatedPassword = password;

        if(!authenticateValid) {
          return null;
        }
        return { id: 'e61e6d38-9de7-11e7-abc4-cec278b6b50a' }
      }
    }
  }
};

let interactionCompleteUuid;
let interactionCompleteData;
const interactionComplete = {
  process: function(uuid, data, res){
    interactionCompleteUuid = uuid;
    interactionCompleteData = data
  }
};

describe('When posting back interaction', function() {
  let sandbox;
  let UsernamePasswordRoutes;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();

    UsernamePasswordRoutes = proxyquire('./../../../src/UsernamePassword/UsernamePasswordRoutes',
      {
        './../Config': config,
        './../InteractionComplete': interactionComplete
      });

    authenticatedUsername = null;
    authenticatedPassword = null;

    interactionCompleteUuid = null;
    interactionCompleteData = null;
  });
  afterEach(function() {
    sandbox.restore();
  });

  it('then it should authenticate user with posted username and password', function() {
    UsernamePasswordRoutes.post(req, res);

    expect(authenticatedUsername).to.equal(req.body.username);
    expect(authenticatedPassword).to.equal(req.body.password);
  });

  describe('and the username/password is correct', function() {

    beforeEach(function() {
      authenticateValid = true;
    });

    it('then it should process interaction complete', function() {
      UsernamePasswordRoutes.post(req, res);

      expect(interactionCompleteUuid).to.equal(req.params.uuid);
      expect(interactionCompleteData).to.not.be.null;
      expect(interactionCompleteData).to.have.property('uid');
      expect(interactionCompleteData.uid).to.equal('e61e6d38-9de7-11e7-abc4-cec278b6b50a');
    });

  });

  describe('and the username/password is incorrect', function() {

    beforeEach(function() {
      authenticateValid = false;
    });

    it('then it should render the view', function() {
      const mock = sinon.mock(res);
      mock.expects('render').withArgs('usernamepassword/index').once();

      UsernamePasswordRoutes.post(req, res);

      mock.verify();
    });

    it('then it should be a failed login', function() {
      const mock = sinon.mock(res);
      mock.expects('render').withArgs('usernamepassword/index', {isFailedLogin: true}).once();

      UsernamePasswordRoutes.post(req, res);

      mock.verify();
    });

  });

});