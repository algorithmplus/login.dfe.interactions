'use strict';

const get = (req, res) => {
  const serviceName = req.migrationUser.clientName;

  res.render('migration/views/migrationIntro', {
    message: '',
    title: 'DfE Sign-in',
    uuid: req.params.uuid,
    csrfToken: req.csrfToken(),
    validationMessages: {},
    serviceName,
  });
};

module.exports = get;
