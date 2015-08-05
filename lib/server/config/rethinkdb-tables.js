const logger = require('../../logging/logger');

const tables = module.exports = {
    usage: 'usage',
    daily: 'daily'
}

module.exports.createTables = function* (r) {
    logger.info('ensure tables are created');
    return yield Object.keys(tables).map(function* (tableName) {
        try {
            yield r.tableCreate(tableName);
            logger.info('created table:', tableName);
        } catch (error) {
            if (error.name !== 'ReqlRuntimeError') {
                throw new Error(error);
            }
        }
    });
}
