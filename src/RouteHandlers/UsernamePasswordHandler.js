class UsernamePasswordHandler {
    static handle(req, res) {
        const uuid = req.query.uuid;
        res.redirect(`/interactioncomplete?uuid=${uuid}&uid=abc`);
    }
}

module.exports = UsernamePasswordHandler;

