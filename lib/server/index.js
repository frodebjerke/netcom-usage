const express = require('express');
const routes = require('./routes');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const r = require('./config/rethinkdb-connection');
const setupDatabaseSchema = require('./config/rethinkdb-tables').createTables;
const logger = require('../logging/logger');
const co = require('co');

module.exports.run = function (config) {

    const app = setup();

    app.use('/', routes);

    app.listen(config.port);

}

function setup () {

    const app = express();

    co(r.setupDb())
    .then(function () {
        co(setupDatabaseSchema(r))
        .catch(function (error) {
            logger.error('server-setup:', 'Failed to ensure database schema was setup.');
            logger.info ('server-setup:', error);
            throw new Error('Server crashed.');
        });
    });

    app.use(morgan('combined'));
    app.use(bodyParser.json());

    return app;
}
