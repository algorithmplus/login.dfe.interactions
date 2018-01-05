const hasConfirmedIdentity = (req, res, next) => {
  if (req.session && req.session.uid) {
    return next();
  }
  return res.redirect('confirm');
};

module.exports = hasConfirmedIdentity;