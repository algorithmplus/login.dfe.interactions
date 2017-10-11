'use strict';

const action = (req, res) => {
  res.render('resetpassword/request', {
    csrfToken: req.csrfToken(),
    email: '',
    validationFailed: false,
    validationMessages: {
      email: ''
    }
  });
};

module.exports = action;