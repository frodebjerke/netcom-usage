const r = require('../../config/rethinkdb-connection');
const mapper = require('./usage-mapper');
const logger = require('../../../logging/logger');

module.exports.storeUsage = function* (data) {
    const usage = mapper(data);
    const res = yield r.table('usage').insert(usage);

    logger.debug('store-usage:', res);

    return res;
}
