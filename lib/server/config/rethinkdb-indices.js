const r = require('./rethinkdb-connection');
const tables = require('./rethinkdb-tables');
const logger = require('../../logging/logger');

module.exports = function* () {
    return yield [
        ensureIndex(tables.usage, 'timestamp'),
        ensureIndex(tables.usage, 'networkId'),
        ensureIndex(tables.daily, 'date')
    ];
}

function* ensureIndex(table, column) {
    try {
        yield r.table(table).indexCreate(column)
        logger.info('created index:', table, column);
    } catch (error) {
        if (error.name !== 'ReqlRuntimeError') {
            throw new Error(error);
        }
    }
}
