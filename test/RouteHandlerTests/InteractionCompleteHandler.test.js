const expect = require('chai').expect;
const sinon = require('sinon');

const cacheProvider = require('./../../src/Caching/MemoryCache');
const cache = new cacheProvider();

const interactionCompleteHandler = require('./../../src/RouteHandlers/InteractionCompleteHandler');

describe('When handling interaction complete', function () {
    let req;
    let res;


    beforeEach(function () {
        cache.set('abc', {uid: '123456'});

        req = {
            query: {
                uuid: 'abc'
            }
        };
        res = {
            lastContent: null,
            set: function (header, value) {
            },
            send: function (content) {
                this.lastContent = content;
            }
        };
    });
    afterEach(function () {
        cache.remove('abc');
    })

    it('then is should set the content type to html', function () {
        const mock = sinon.mock(res);
        mock.expects('set').withArgs('Content-Type', 'text/html').once();

        return interactionCompleteHandler.handle(req, res).then(function () {
            mock.verify();
        });
    });

    it('then it should send a form in the content that will post back to the OIDC server', function () {
        return interactionCompleteHandler.handle(req, res).then(function () {
            expect(res.lastContent).to.match(/\<form.*action=\"https:\/\/localhost:4430\/interaction\/abc\/complete\"/);
        });
    });

    it('then it include a uuid field in the form', function () {
        return interactionCompleteHandler.handle(req, res).then(function () {
            expect(res.lastContent).to.match(/\<input\sname=\"uuid\"\stype=\"hidden\"\svalue=\"abc\"\s\/\>/);
        });
    });

    it('then it include a uid field in the form', function () {
        return interactionCompleteHandler.handle(req, res).then(function () {
            expect(res.lastContent).to.match(/\<input\sname=\"uid\"\stype=\"hidden\"\svalue=\"123456\"\s\/\>/);
        });
    });
});