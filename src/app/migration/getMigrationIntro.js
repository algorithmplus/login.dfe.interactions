'use strict';

const get = (req, res) => {
  res.render('migration/views/migrationIntro', {
    message: '',
    title: 'DfE Sign-in',
    uuid: req.params.uuid,
    csrfToken: req.csrfToken(),
    validationMessages: {},
  });
};

module.exports = get;
