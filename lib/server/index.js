const express = require('express');
const routes = require('./routes');
const morgan = require('morgan');


module.exports.run = function (config) {

    const app = setup();

    app.use(morgan());

    app.use('/', routes);

    app.listen(config.serverPort);

}

function setup () {

    const app = express();

    return app;
}
