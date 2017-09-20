class DevRoutes {
  static register(app) {
    app.get('/', DevRoutes.launchPad);
  }

  static launchPad(req, res) {
    res.render('dev/launchpad');
  }
}

module.exports = DevRoutes;