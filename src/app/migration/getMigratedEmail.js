'use strict';

const get = (req, res) => {
  const user = req.migrationUser;
  req.session.resend = undefined;

  let viewToDisplay = 'migration/views/email';

  if(!user.email) {
    viewToDisplay = 'migration/views/no-email';
  }

  res.render(viewToDisplay, {
    message: '',
    title: 'DfE Sign-in',
    uuid: req.params.uuid,
    csrfToken: req.csrfToken(),
    user,
    hideUserNav: true,
    backLink: true,
    validationMessages: {},
    viewToDisplay,
  });
};

module.exports = get;
