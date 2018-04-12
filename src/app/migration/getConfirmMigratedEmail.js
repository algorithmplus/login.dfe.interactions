'use strict';

const get = (req, res) => {

  if (req.params.uid) {
    res.render('migration/views/confirmEmail', {
      message: '',
      title: 'DfE Sign-in',
      emailConfId: req.params.emailConfId,
      csrfToken: req.csrfToken(),
      validationMessages: {},
    });
  }
};

module.exports = get;
