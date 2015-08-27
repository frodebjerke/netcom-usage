const r = require('../../config/rethinkdb-connection');
const logger = require('../../../logging/logger');
const tables = require('../../config/rethinkdb-tables');
const usageRepo = require('../usage');
const mapper = require('./daily-mapper');
const moment = require('moment');
const co = require('co');
const _ = require('lodash');

module.exports.get = get;
module.exports.getAll = getAll;
module.exports.getRange = getRange;
module.exports.upsert = upsert;

module.exports.monitorUsage = function () {
    r.table(tables.usage).changes().run()
        .then(function (cursor) {
            logger.info("daily usage monitor:", "monitor initiated!");
            cursor.each(function (err, change) {
                    if (err) {
                        logger.error('daily usage monitor:', err);
                        return
                    }

                    if (!change.new_val) {
                        return // nothing new
                    }

                    const sample = change.new_val;
                    logger.debug('daily usage monitor:', change);

                    co(updateDaily(sample))
                    .catch(function (error) {
                        logger.error('daily usage monitor', 'failed to update daily for', sample.networkId)
                        logger.info('daily usage monitor:', error);
                    });
                });

        })
        .catch(function (err) {
            logger.error('daily usage monitor:', 'Could not start monitoring usage.', err);
        });
}

module.exports.rebuild = function* () {

    const all = yield r.table(tables.usage).default([]);

    for (var i = 0; i < all.length; i++) {
        yield updateDaily(all[i]);
    }

    logger.info('daily usage', 'daily table rebuilt from usage');
}

function* get(networkId, date) {

    const id = mapper.getId(networkId, moment(date).startOf('day'));

    const res = r.table(tables.daily)
        .get(id)
        .default(null);

    return res;
}

function* getAll(networkId) {
    const res = r.table(tables.daily)
        .filter({networkId: networkId})
        .orderBy(r.desc('timestamp'))
        .default([]);

    return res;
}

function* getRange(networkId, start, stop) {

    const res = r.table(tables.daily)
        .between(start, stop, { index: 'date' })
        .filter({networkId: networkId})
        .orderBy(r.desc('timestamp'))
        .default([]);

    return res;
}

function* upsert(daily) {

    const res = yield r.table(tables.daily).insert(daily, {
        conflict: 'replace'
    });

    if (res.inserted === parseInt(1)) {
        logger.info('daily usage monitor:', 'daily created');
    }
    else if (res.replaced === parseInt(1)) {
        logger.info('daily usage monitor:', 'daily updated');
    }
    else {
        logger.error('daily usage monitor:', 'non expected result from upsert.', res);
    }
}

function* updateDaily (sample) {

    const startOfDay = moment(sample.timestamp).startOf('day');

    const results = yield [
        newestBeforeOrEarliestAfter(sample.networkId, startOfDay.format()),
        get(sample.networkId, startOfDay.format())
    ];

    const lastSampleBeforeDay = results[0];
    const daily = results[1];

    if (!daily || (sample.dataleft !== daily.dataleft && moment(sample.timestamp) >= moment(daily.timestamp))) {
        const alreadyUsed = daily ? daily.dataused : 0;
        const dataUsed = mapper.getDataUsed(daily, sample, lastSampleBeforeDay)
        yield upsert(mapper(sample, dataUsed));
    }
}

function* newestBeforeOrEarliestAfter (networkId, limitter) {
    try {
        return yield usageRepo.getNewestSample(networkId, limitter);
    } catch (error) {
        if (error.name === "ReqlRuntimeError") {
            return yield usageRepo.getEarliestSample(networkId)
        }
        throw new Error(error);
    }
}
