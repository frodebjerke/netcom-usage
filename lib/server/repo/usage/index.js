const r = require('../../config/rethinkdb-connection');
const mapper = require('./usage-mapper');
const _ = require('lodash');
const moment = require('moment');
const tables = require('../../config/rethinkdb-tables');
const logger = require('../../../logging/logger');

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

module.exports.getNewestSample = function* (networkId, dateLimitter) {

    const filter = dateLimitter ? r.row('networkId').eq(networkId).and(r.row('timestamp').lt(dateLimitter)) : {
        networkId: networkId
    };

    const res = yield r.table(tables.usage)
        .filter(filter)
        .max('timestamp')

    return res;
}

module.exports.getEarliestSample = function* (networkId) {

    const res = yield r.table(tables.usage)
        .filter({networkId: networkId})
        .min('timestamp');

    return res;
}
