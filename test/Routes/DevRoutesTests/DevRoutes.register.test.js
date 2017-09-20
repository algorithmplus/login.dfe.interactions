const sinon = require('sinon');

const DevRoutes = require('./../../../src/Routes/DevRoutes');

const app = {
  get: function(template, action){},
  post: function(template, action){}
};

describe('When registering dev routes', function() {
  let sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });
  afterEach(function() {
    sandbox.restore();
  });

  it('then it should register launchpad route', function() {
    const mock = sinon.mock(app);
    mock.expects('get').withArgs('/', DevRoutes.launchPad).once();

    DevRoutes.register(app);

    mock.verify();
  });
});