'use strict';

const get = (req, res) => {
  res.render('usernamepassword/index', {
    isFailedLogin: false,
    message: '',
    csrfToken: req.csrfToken(),
  });
};

module.exports = get;
