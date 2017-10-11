'use strict';

const get = (req, res) => {
  res.render('usernamepassword/index', {
    isFailedLogin: false,
    message: '',
    title: 'Sign in',
    csrfToken: req.csrfToken(),
  });
};

module.exports = get;
