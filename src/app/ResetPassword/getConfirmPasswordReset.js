'use strict';

const action = (req, res) => {
  res.render('ResetPassword/views/confirm', {
    csrfToken: req.csrfToken(),
    email: '',
    code: '',
    validationFailed: false,
    validationMessages: {},
  });
};

module.exports = action;