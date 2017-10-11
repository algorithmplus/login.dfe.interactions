'use strict';

const get = (req, res) => {
  res.render('UsernamePassword/views/index', {
    isFailedLogin: false,
    message: '',
    title: 'Sign in',
    csrfToken: req.csrfToken(),
  });
};

module.exports = get;
