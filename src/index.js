const express = require('express');
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir:'./src' });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = express();

    server.get('/cb', (req, res) => {
        res.set('Content-Type', 'text/html');
        res.send(`<html><body><form id="cbform" action="https://localhost:4430/logincomplete" method="post"><input name="uuid" type="hidden" value=${req.query.uuid} /><input name="uid" type="hidden" value=${req.query.uid} /></form><script>document.getElementById('cbform').submit();</script></body>`);
    });

    server.get('*', (req, res) => {
      return handle(req, res)
    });

    server.post('/usernamepassword', (req, res) => {
       const uuid = req.query.uuid;
       res.redirect(`/cb?uuid=${uuid}&uid=abc`);
    });

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    })
  });
