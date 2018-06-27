'use strict';

const get = (req, res) => {
  const user = req.session.migrationUser;

  res.render('migration/views/alreadyMigrated', {
    title: 'Sign in with your new details',
    user,
    hideUserNav: true,
  });
};

module.exports = get;
