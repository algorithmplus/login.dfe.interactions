const express = require('express');
const next = require('next');
const fs = require('fs');
const bodyParser = require('body-parser');
const routerMounter = require('./RouteHandlers/RouteMounter');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({dev, dir: './src'});
const handle = nextApp.getRequestHandler();

const isDevEnv = (process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'dev');

nextApp.prepare()
    .then(() => {
        const app = express();

        app.use(bodyParser.urlencoded({extended: true}));

        const options = {
            key: isDevEnv ? fs.readFileSync('./ssl/localhost.key') : null,
            cert: isDevEnv ? fs.readFileSync('./ssl/localhost.cert') : null,
            requestCert: false,
            rejectUnauthorized: false,
        };

        if (isDevEnv) {
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

        if (!isDevEnv) {
            app.get('/', (req, res) => {
                res.status(404);
                res.send('');
            });
            app.get('/index', (req, res) => {
                res.status(404);
                res.send('');
            });
        }

        app.get('*', (req, res) => {
            return handle(req, res)
        });


    });