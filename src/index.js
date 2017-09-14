const express = require('express');
const next = require('next');
const fs = require('fs');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir:'./src' });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const app = express();

    const options = {
      key: (process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'dev') ? fs.readFileSync('./ssl/localhost.key') : null,
      cert: (process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'dev') ? fs.readFileSync('./ssl/localhost.cert') : null,
      requestCert: false,
      rejectUnauthorized: false,
    };

    if (process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'dev') {
      const https = require('https');
      const server = https.createServer(options, app);

      server.listen(port, () => {
        console.log(`Dev server listening on https://localhost:${process.env.PORT}`);
      });
    } else {
      app.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
      });
    }

    app.get('/cb', (req, res) => {
        res.set('Content-Type', 'text/html');
        res.send(`<html><body><form id="cbform" action="https://localhost:4430/interaction/${req.query.uuid}/complete" method="post"><input name="uuid" type="hidden" value=${req.query.uuid} /><input name="uid" type="hidden" value=${req.query.uid} /></form><script>document.getElementById('cbform').submit();</script></body>`);
    });

    app.get('*', (req, res) => {
      return handle(req, res)
    });

    app.post('/usernamepassword', (req, res) => {
       const uuid = req.query.uuid;
       res.redirect(`/cb?uuid=${uuid}&uid=abc`);
    });


  });
// https://localhost:4430/auth?client_id=foo&response_type=code&scope=openid+email&nonce=foobar&prompt=login&redirect_uri=https://localhost:1234/asdasd