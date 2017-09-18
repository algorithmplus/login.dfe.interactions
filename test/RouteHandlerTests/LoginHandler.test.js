const sinon = require('sinon');

const loginHandler = require('../../src/RouteHandlers/LoginHandler');

describe('When handling a usernamepassword postback', function () {
    let sandbox;
    let req;
    let res;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        req = {
            query: {
                uuid: '123'
            },
            body: {
                username: 'foo@example.com',
                password: 'pass'
            }
        };
        res = {
            redirect: function (path) {
            }
        };
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe('for a valid username/password', function () {

        it('then it should redirect to interactioncomplete', function () {
            const mock = sinon.mock(res);
            mock.expects('redirect').withArgs('/interactioncomplete?uuid=123').once();

            return loginHandler.handle(req, res).then(function () {
                mock.verify();
            });
        });
    });

    describe('for an invalid username/password', function () {
        beforeEach(function () {
            req.body.username = 'bar@example.com';
        });

        it('then it should return the login view', function () {
            const mock = sinon.mock(res);
            mock.expects('redirect').withArgs('/login?uuid=123&message=invalid%20username%20or%20password').once();

            return loginHandler.handle(req, res).then(function () {
                mock.verify();
            });
        });
    });

});