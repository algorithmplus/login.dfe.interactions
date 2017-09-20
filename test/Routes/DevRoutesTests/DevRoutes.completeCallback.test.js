const sinon = require('sinon');
const expect = require('chai').expect;

const DevRoutes = require('./../../../src/Routes/DevRoutes');

const req = {
  body: {
    item1: 'value 1',
    item2: 'value 2',
    sig: 'adfafd'
  }
};
const res = {
  render: function(view,model){}
}

describe('When post for interaction complete callback received', function() {
  let sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    sinon.spy(res, "render");
  });
  afterEach(function() {
    res.render.restore();
    sandbox.restore();
  });

  it('then it should render the view', function() {
    DevRoutes.completeCallback(req, res);

    expect(res.render.called).to.be.true;
    expect(res.render.getCall(0).args[0]).to.equal('dev/complete');
  });

  it('then it should include body data as model', function() {
    DevRoutes.completeCallback(req, res);

    expect(res.render.called).to.be.true;
    expect(res.render.getCall(0).args[1].data).to.equal(req.body);
  });

});