'use strict';

const action = (req, res) => {
  res.render('ResetPassword/views/confirm', {
    csrfToken: req.csrfToken(),
    title: 'Reset your password',
    uid: req.params.uid,
    code: '',
    validationFailed: false,
    validationMessages: {},
  });
};

module.exports = action;
