const expect = require('chai').expect;
const sinon = require('sinon');
const express = require('express');

const routeMounter = require('./../../src/RouteHandlers/RouteMounter');
const usernamePasswordHandler = require('./../../src/RouteHandlers/UsernamePasswordHandler');
const interactionCompleteHandler = require('./../../src/RouteHandlers/InteractionComplete');

describe('When mounting routes', function() {

    const app = express();
    let sandbox;

    beforeEach(function() {
        sandbox = sinon.sandbox.create();
    });
    afterEach(function(){
        sandbox.restore();
    });

    it('it should add a route to post usernamepassword to', function() {
        const mock = sinon.mock(app);
        mock.expects('post').withArgs('/usernamepassword', usernamePasswordHandler.handle).once();

        routeMounter.init(app);

        mock.verify();
    });

    it('it should add a route to get interactioncomplete', function() {
        const mock = sinon.mock(app);
        mock.expects('get').withArgs('/interactioncomplete', interactionCompleteHandler.handle).once();

        routeMounter.init(app);

        mock.verify();
    });
});