// require('ignore-styles');

// require('@babel/register')({
//     ignore: [/(node_modules)/],
//     presets: ['@babel/preset-env', '@babel/preset-react']
// });

// const router = require('../../../b2c-app/src/server')();

const cors = require('cors');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const router = express.Router({ mergeParams: true });
const { exec } = require('child_process');

exec('./node_modules/.bin/sass src/app/b2c/assets/main.scss src/app/b2c/assets/main.css', (err, stdout, stderr) => {
    if (err) {
        // node couldn't execute the command
        return;
    }
});

module.exports = (csrf) => {
    router.use(expressLayouts);
    router.use(cors());

    router.get('/assets/:resource', (req, res) => {

    });

    router.get('*', (req, res) => {
        res.render(`b2c/views/${req.url}`, {
            layout: 'b2c/views/layout'
        });
    });

    return router;
}