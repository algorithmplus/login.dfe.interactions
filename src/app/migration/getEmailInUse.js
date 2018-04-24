'use strict';

const get = (req, res) => {
  const user = req.session.migrationUser;

  res.render('migration/views/email-in-use', {
    message: '',
    title: 'DfE Sign-in',
    uuid: req.params.uuid,
    csrfToken: req.csrfToken(),
    user,
    hideUserNav: true,
    backLink: true,
    validationMessages: {},
  });
};

module.exports = get;
