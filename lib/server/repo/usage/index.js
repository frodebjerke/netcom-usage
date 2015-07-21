const r = require('../../config/rethinkdb-connection');
const mapper = require('./usage-mapper');
const logger = require('../../../logging/logger');
const tables = require('../../config/rethinkdb-tables');

module.exports.storeUsage = function* (data) {
    const usage = mapper(data);
    const res = yield r.table(tables.usage).insert(usage, {returnChanges: true});

    logger.debug('store-usage:', res);

    return res;
}

module.exports.getUsage = function* () {

    const res = yield r.table(tables.usage);

    return res;
}
