const expect = require('chai').expect;
const proxyquire =  require('proxyquire');

const app = {};

let _devRoutesRegisterCalled;
const devRoutesStub = class {
  static register(app){
    _devRoutesRegisterCalled = true;
  }
};

let _usernamePasswordRoutesRegisterCalled;
const usernamePasswordRoutesStub = class {
  static register(app){
    _usernamePasswordRoutesRegisterCalled = true;
  }
};

const configStub = {
  hostingEnvironment: {
    env: 'dev'
  }
};

describe('When registering routes', function() {

  let routes;

  beforeEach(function() {
    _devRoutesRegisterCalled = false;
    _usernamePasswordRoutesRegisterCalled = false;

    routes = proxyquire('./../../../src/Routes',
      {
        './DevRoutes': devRoutesStub,
        './../Config': configStub,
        './../UsernamePassword/UsernamePasswordRoutes': usernamePasswordRoutesStub
      });
  });

  describe('And in dev environment', function() {

    beforeEach(function() {
      configStub.hostingEnvironment.env = 'dev';
    });

    it('Then it should register dev routes', function() {
      routes.register(app);

      expect(_devRoutesRegisterCalled).to.be.true;
    });

  });

  describe('And not in dev environment', function() {

    beforeEach(function() {
      configStub.hostingEnvironment.env = 'prod';
    });

    it('Then it should not register dev routes', function() {
      routes.register(app);

      expect(_devRoutesRegisterCalled).to.be.false;
    });

  });


  it('Then it should register UsernamePassword routes', function() {
    routes.register(app);

    expect(_usernamePasswordRoutesRegisterCalled).to.be.true;
  });

});