'use strict';

const get = (req, res) => {
  const user = req.session.migrationUser;


  res.render('migration/views/userDetail', {
    message: '',
    title: 'DfE Sign-in',
    uuid: req.params.uuid,
    csrfToken: req.csrfToken(),
    user,
    validationMessages: {},
  });
};

module.exports = get;
