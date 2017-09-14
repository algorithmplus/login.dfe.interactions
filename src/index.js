const express = require('express');
const next = require('next');
const fs = require('fs');
const routerMounter = require('./RouteHandlers/RouteMounter');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({dev, dir: './src'});
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

        routerMounter.init(app);

        app.get('*', (req, res) => {
            return handle(req, res)
        });


    });