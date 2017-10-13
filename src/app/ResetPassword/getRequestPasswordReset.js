'use strict';

const action = (req, res) => {
  res.render('ResetPassword/views/request', {
    csrfToken: req.csrfToken(),
    email: '',
    validationFailed: false,
  });
};

module.exports = action;