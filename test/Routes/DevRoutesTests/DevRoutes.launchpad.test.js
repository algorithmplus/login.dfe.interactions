const sinon = require('sinon');

const DevRoutes = require('./../../../src/Routes/DevRoutes');

const req = {
};
const res = {
  render: function(view){}
};

describe('When getting launchpad', function() {
  let sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });
  afterEach(function() {
    sandbox.restore();
  });

  it('then it should render the view', function() {
    const mock = sinon.mock(res);
    mock.expects('render').withArgs('dev/launchpad').once();

    DevRoutes.launchPad(req, res);

    mock.verify();
  });
});