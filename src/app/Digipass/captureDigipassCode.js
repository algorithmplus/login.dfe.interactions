const action = (req, res) => {
  res.render('Digipass/views/token', {
    csrfToken: req.csrfToken(),
    code: '',
    validationMessages: {
      code: '',
    },
  });
};

module.exports = action;
