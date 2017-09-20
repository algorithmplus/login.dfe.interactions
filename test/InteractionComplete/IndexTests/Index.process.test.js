const expect = require('chai').expect;
const proxyquire =  require('proxyquire');
const fs = require('fs');

const config = {
  oidcService: {
    url: 'http://unit.tests'
  },
  crypto: {
    signing: {
      privateKey: fs.readFileSync('./ssl/localhost.key', 'utf8')
    }
  }
};

const uuid = 'a77fb8be-9dee-11e7-abc4-cec278b6b50a';
const uid = 'a77fbcba-9dee-11e7-abc4-cec278b6b50a';
let renderView;
let renderModel;
const res = {
  render:function(view, model){
    renderView = view;
    renderModel = model;
  }
};

describe('When processing interaction complete', function() {
  let InteractionComplete;

  beforeEach(function() {
    InteractionComplete = proxyquire('./../../../src/InteractionComplete',
      {
        './../Config': config
      });
  });

  it('then it should render the interaction complete view', function() {
    InteractionComplete.process(uuid, {uid: uid, dataItem1: 'stuff'}, res);

    expect(renderView).to.equal('interactioncomplete/index');
  });

  it('then it should include oidc server postback url', function() {
    InteractionComplete.process(uuid, {uid: uid, dataItem1: 'stuff'}, res);

    expect(renderModel).to.not.be.null;
    expect(renderModel).to.have.property('destination');
    expect(renderModel.destination).to.equal(`${config.oidcService.url}/${uuid}/complete`)
  });

  it('then it should include data items in postback data', function() {
    InteractionComplete.process(uuid, {uid: uid, dataItem1: 'stuff'}, res);

    expect(renderModel).to.not.be.null;
    expect(renderModel).to.have.property('postbackData');
    expect(renderModel.postbackData).to.have.property('uid');
    expect(renderModel.postbackData.uid).to.equal(uid);
    expect(renderModel.postbackData).to.have.property('dataItem1');
    expect(renderModel.postbackData.dataItem1).to.equal('stuff');
  });

  it('then it should include uuid in postback data', function() {
    InteractionComplete.process(uuid, {uid: uid, dataItem1: 'stuff'}, res);

    expect(renderModel).to.not.be.null;
    expect(renderModel).to.have.property('postbackData');
    expect(renderModel.postbackData).to.have.property('uuid');
    expect(renderModel.postbackData.uuid).to.equal(uuid);
  });

  it('then it should include sig in postback data', function() {
    InteractionComplete.process(uuid, {uid: uid, dataItem1: 'stuff'}, res);

    expect(renderModel).to.not.be.null;
    expect(renderModel).to.have.property('postbackData');
    expect(renderModel.postbackData).to.have.property('sig');
    expect(renderModel.postbackData.sig).to.not.be.empty;
  });

});