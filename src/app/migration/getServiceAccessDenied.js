const getServiceAccessDenied = async (req, res) => {
  const user = req.session.migrationUser;

  res.render('migration/views/serviceAccessDenied', {
    title: 'You do not have access to this service',
    user,
    hideUserNav: true,
  });
};

module.exports = getServiceAccessDenied;
