const express = require('express');
const routes = require('./routes');
const morgan = require('morgan');
const bodyParser = require('body-parser');


module.exports.run = function (config) {

    const app = setup();

    app.use('/', routes);

    app.listen(config.serverPort);

}

function setup () {

    const app = express();

    app.use(morgan('combined'));
    app.use(bodyParser.json());

    return app;
}
