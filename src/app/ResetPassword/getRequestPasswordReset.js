'use strict';

const action = (req, res) => {
  res.render('ResetPassword/views/request', {
    csrfToken: req.csrfToken(),
    email: '',
    validationMessages: {},
    validationFailed: false,
  });
};

module.exports = action;
