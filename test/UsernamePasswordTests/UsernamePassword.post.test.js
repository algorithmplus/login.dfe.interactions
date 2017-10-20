// const usernamePassword = require('./../../src/UsernamePassword/postUsernamePassword');
const utils = require('./../utils');

describe('When user submits username/password', () => {
  let req;
  let res;
  let interactionCompleteProcess;
  let usersAuthenticate;
  let clientsGet;
  
  let postHandler;

  beforeEach(() => {
    req = utils.mockRequest();
    req.query.clientId = 'test';
    req.body.username = 'Tony@Stark.com';
    req.body.password = 'IAmIronman!';
    req.params.uuid = 'some-uuid';
    req.csrfToken.mockReturnValue('my-secure-token');
    
    res = utils.mockResponse();

    interactionCompleteProcess = jest.fn();
    const interactionComplete = require('./../../src/app/InteractionComplete');
    interactionComplete.process = interactionCompleteProcess;

    usersAuthenticate = jest.fn();
    const users = require('./../../src/infrastructure/Users');
    users.authenticate = usersAuthenticate;

    clientsGet = jest.fn().mockReturnValue({
      client_id: 'test',
    });
    const clients = require('./../../src/infrastructure/Clients');
    clients.get = clientsGet;
    
    postHandler = require('./../../src/app/UsernamePassword/postUsernamePassword');
  });

  describe('with a invalid username/password', () => {
    beforeEach(() => {
      usersAuthenticate.mockReturnValue(null);
    });

    it('then it should render usernamepassword view', async () => {
      await postHandler(req, res);

      expect(res.render.mock.calls.length).toBe(1);
      expect(res.render.mock.calls[0][0]).toBe('UsernamePassword/views/index');
    });
    
    it('then a validation message will appear if the email is not present', async () => {
      req.body.username = '';

      await postHandler(req, res);

      expect(res.render.mock.calls[0][1].emailValidationMessage).toBe('Enter your email address');
    });
    
    it('then a validation message will appear if the email is not in the correct format', async () => {
      req.body.username = 'Tony';

      await postHandler(req, res);

      expect(res.render.mock.calls[0][1].emailValidationMessage).toBe('Enter a valid email address');
    });
    
    it('then a validation message will appear if the password is not present', async () => {
      req.body.password = '';

      await postHandler(req, res);

      expect(res.render.mock.calls[0][1].passwordValidationMessage).toBe('Enter your password');
    });
    
    it('then a validation message will appear if the email and password is not present', async () => {
      req.body.password = '';
      req.body.username = '';

      await postHandler(req, res);

      expect(res.render.mock.calls[0][1].passwordValidationMessage).toBe('Enter your password');
      expect(res.render.mock.calls[0][1].emailValidationMessage).toBe('Enter your email address');
    });
    
    it('then a validation message will appear if the email and password is not present', async () => {
      req.body.password = '';
      req.body.username = 'Tony';

      await postHandler(req, res);

      expect(res.render.mock.calls[0][1].passwordValidationMessage).toBe('Enter your password');
      expect(res.render.mock.calls[0][1].emailValidationMessage).toBe('Enter a valid email address');
    });

    it('then it should be a failed login', async () => {
      await postHandler(req, res);

      expect(res.render.mock.calls[0][1].isFailedLogin).toBe(true);
      expect(res.render.mock.calls[0][1].message).toBe('Invalid email address or password. Try again.');
    });

    it('then it should include the csrf token', async () => {
      await postHandler(req, res);

      expect(res.render.mock.calls[0][1].csrfToken).toBe('my-secure-token');
    });
  });

  describe('with a valid username/password', () => {
    beforeEach(() => {
      usersAuthenticate.mockReturnValue({
        id: 'user1',
      });
    });

    it('then it should process interaction complete for uuid', async () => {
      await postHandler(req, res);

      expect(interactionCompleteProcess.mock.calls.length).toBe(1);
      expect(interactionCompleteProcess.mock.calls[0][0]).toBe('some-uuid');
    });

    it('then it should process interaction complete for userid', async () => {
      await postHandler(req, res);

      expect(interactionCompleteProcess.mock.calls[0][1]).not.toBeNull();
      expect(interactionCompleteProcess.mock.calls[0][1].uid).toBe('user1');
    });

    it('then it should return success', async () => {
      await postHandler(req, res);

      expect(interactionCompleteProcess.mock.calls[0][1]).not.toBeNull();
      expect(interactionCompleteProcess.mock.calls[0][1].status).toBe('success');
    });
  });

  describe('with an invalid client id', () => {
    beforeEach(() => {
      clientsGet.mockReturnValue(null);
    });

    it('then is should complete interaction', async () => {
      await postHandler(req, res);

      expect(interactionCompleteProcess.mock.calls.length).toBe(1);
      expect(interactionCompleteProcess.mock.calls[0][0]).toBe('some-uuid');
    });

    it('then it should return a failure', async () => {
      await postHandler(req, res);

      expect(interactionCompleteProcess.mock.calls[0][1]).not.toBeNull();
      expect(interactionCompleteProcess.mock.calls[0][1].status).toBe('failed');
      expect(interactionCompleteProcess.mock.calls[0][1].reason).toBe('invalid clientid');
    });
  });
});
