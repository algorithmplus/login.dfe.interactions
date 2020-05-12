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

module.exports = (csrf) => {
    router.use(expressLayouts);

    router.get('/v2/login', (req, res) => {
        res.render('b2c/views/login', {
            layout: 'b2c/views/layout'
        });
    })

    return router;
}