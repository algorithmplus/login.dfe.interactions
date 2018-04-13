'use strict';


const get = (req, res) => {

  if (!req.session.userCode) {
    throw new Error('Invalid Request');
  }

  res.render('migration/views/createPassword', {
    message: '',
    title: 'DfE Sign-in',
    emailConfId: req.params.emailConfId,
    csrfToken: req.csrfToken(),
    validationMessages: {},
    code: req.session.userCode,
    newPassword: '',
    confirmPassword: '',
  });
};

module.exports = get;
