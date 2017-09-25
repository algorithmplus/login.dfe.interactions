const sinon = require('sinon');

const UsernamePasswordRoutes = require('./../../../src/UsernamePassword/UsernamePasswordRoutes');

const app = {
  get: function(template, action){},
  post: function(template, action){}
};
const csrf = {};

describe('When registering username password routes', function() {
  let sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });
  afterEach(function() {
    sandbox.restore();
  });

  it('then it should register get route', function() {
    const mock = sinon.mock(app);
    mock.expects('get').withArgs('/:uuid/usernamepassword', csrf, UsernamePasswordRoutes.get).once();

    UsernamePasswordRoutes.register(app, csrf);

    mock.verify();
  });

  it('then it should register post route', function() {
    const mock = sinon.mock(app);
    mock.expects('post').withArgs('/:uuid/usernamepassword', csrf, UsernamePasswordRoutes.post).once();

    UsernamePasswordRoutes.register(app, csrf);

    mock.verify();
  });

});