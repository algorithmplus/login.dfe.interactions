const action = (req, res) => res.render('Digipass/views/token', {
  csrfToken: req.csrfToken(),
  code: '',
  validationMessages: {},
});

module.exports = action;
