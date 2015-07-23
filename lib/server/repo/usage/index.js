const r = require('../../config/rethinkdb-connection');
const mapper = require('./usage-mapper');
const logger = require('../../../logging/logger');
const tables = require('../../config/rethinkdb-tables');
const _ = require('lodash');
const moment = require('moment');

module.exports.storeUsage = function* (data) {
    const usage = mapper(data);
    const res = yield r.table(tables.usage).insert(usage, {returnChanges: true});

    logger.debug('store-usage:', res);

    return res;
}

module.exports.getUsage = function* (networkId, skip, limit) {

    const res = yield r.table(tables.usage)
        .filter({networkId: networkId})
        .orderBy('timestamp')
        .skip(skip)
        .limit(limit);

    return res;
}

module.exports.getNewestSample = function* (networkId) {
    const res = yield r.table(tables.usage)
        .filter({networkId: networkId})
        .max('timestamp')

    return res;
}
