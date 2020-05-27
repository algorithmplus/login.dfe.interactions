'use strict';

import App from './App';

const path = require('path');
const fs = require('fs');
const cors = require('cors');

const express = require('express');
const router = express.Router({ mergeParams: true });

const React = require('react');
const ReactDOMServer = require('react-dom/server');
import { StaticRouter } from 'react-router-dom';

function getComponent(route) {
    return new Promise((resolve, reject) => {
        let html;
        let context = {};
        try {
            html = ReactDOMServer.renderToString(
                <StaticRouter location={route} context={context}>
                    <App />
                </StaticRouter>
            );
            resolve(html);
        } catch (e) {
            reject(e)
        }
    });
}

function getHTML(app) {
    return new Promise((resolve, reject) => {
        const indexFile = path.resolve(`${process.cwd()}/b2c-app/build/index.html`);
        fs.readFile(indexFile, 'utf8', (err, data) => {
            if (err) {
                console.error('Something went wrong:', err);
                reject('Oops, better luck next time!');
            }

            resolve(data.replace('<div id="root"></div>', `<div id="root">${app}</div>`));
        });
    });
}

module.exports = (csrf) => {
    router.use('/assets', cors(), express.static(`${process.cwd()}/b2c-app/build`));
    router.use('/images', cors(), express.static(`${process.cwd()}/b2c-app/static-assets`));

    router.get('*', cors(), csrf, (req, res) => {
        getComponent(req.url)
            .then((comp) => {
                return getHTML(comp);
            })
            .then((html) => {
                res.status(200).send(html).end();
            })
            .catch((e) => {
                res.status(500).json({ msg: e.message, stack: e.stack }).end();
            });
    });

    console.log('ready');

    return router;
}