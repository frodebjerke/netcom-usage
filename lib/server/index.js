const express = require('express');
const path = require('path');
const routes = require('./routes');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const r = require('./config/rethinkdb-connection');
const setupDatabaseSchema = require('./config/rethinkdb-tables').createTables;
const setupIndices = require('./config/rethinkdb-indices');
const logger = require('../logging/logger');
const co = require('co');
const favicon = require('serve-favicon');

module.exports.run = function (config) {

    const app = setup();

    app.use('/', routes);

    app.listen(config.port);

}

function setup () {

    const app = express();

    co(r.setupDb())
    .then(function () {
        return co(setupDatabaseSchema(r))
        .catch(function (error) {
            logger.error('server-setup:', 'Failed to ensure database schema was setup.');
            logger.info ('server-setup:', error);
            throw new Error('Server crashed.');
        });
    })
    .then(function () {
        return co(setupIndices())
    });

    app.use(morgan('combined'));
    app.use(bodyParser.json());
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    app.use(favicon(__dirname + '/public/favicon.ico'))

    return app;
}
