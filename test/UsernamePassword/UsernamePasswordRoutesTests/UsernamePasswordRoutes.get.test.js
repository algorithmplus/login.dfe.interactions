const sinon = require('sinon');

const UsernamePasswordRoutes = require('./../../../src/UsernamePassword/UsernamePasswordRoutes');

const req = {
  csrfToken: function() {return 'csrf-token';}
};
const res = {
  render: function(view){}
};

describe('When getting interaction', function() {
  let sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });
  afterEach(function() {
    sandbox.restore();
  });

  it('then it should render the view', function() {
    const mock = sinon.mock(res);
    mock.expects('render').withArgs('usernamepassword/index').once();

    UsernamePasswordRoutes.get(req, res);

    mock.verify();
  });

  it('then it should not be a failed login', function() {
    const mock = sinon.mock(res);
    mock.expects('render').withArgs('usernamepassword/index', {isFailedLogin: false, message: '', csrfToken: 'csrf-token'}).once();

    UsernamePasswordRoutes.get(req, res);

    mock.verify();
  });
});