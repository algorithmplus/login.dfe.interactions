const sinon = require('sinon');
const expect = require('chai').expect;

const DevRoutes = require('./../../../src/Routes/DevRoutes');

const app = {
  get: function(template, action){},
  post: function(template, action){}
};

describe('When registering dev routes', function() {
  let sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    sinon.spy(app, "get");
    sinon.spy(app, "post");
  });
  afterEach(function() {
    app.get.restore();
    app.post.restore();
    sandbox.restore();
  });

  it('then it should register launchpad route', function() {
    DevRoutes.register(app);

    expect(app.get.called).to.be.true;
    expect(app.get.calledWith('/', DevRoutes.launchPad)).to.be.true;
  });


  it('then it should register complete route', function() {
    DevRoutes.register(app);

    expect(app.post.called).to.be.true;
    expect(app.post.calledWith('/dev/:uuid/complete', DevRoutes.completeCallback)).to.be.true;
  });
});