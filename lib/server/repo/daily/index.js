const r = require('../../config/rethinkdb-connection');
const logger = require('../../../logging/logger');
const tables = require('../../config/rethinkdb-tables');
const usageRepo = require('../usage');
const mapper = require('./daily-mapper');
const moment = require('moment');
const co = require('co');

function* get(networkId, date) {

    const id = mapper.getId(networkId, moment(date).startOf('day'));

    const res = r.table(tables.daily)
        .get(id)
        .default(null);

    return res;
}

function* upsert(daily) {

    const res = yield r.table(tables.daily).insert(daily, {
        conflict: 'replace'
    });

    if (res.inserted === parseInt(1)) {
        logger.debug('daily usage monitor:', 'daily created');
    }
    else if (res.replaced === parseInt(1)) {
        logger.debug('daily usage monitor:', 'daily updated');
    }
    else {
        logger.error('daily usage monitor:', 'non expected result from upsert.', res);
    }
}

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

                    const startOfDay = moment(sample.timestamp).startOf('day');

                    co(function* () {
                        const results = yield [
                            newestBeforeOrEarliestAfter(sample.networkId, startOfDay.format()),
                            get(sample.networkId, startOfDay.format())
                        ];

                        const lastSampleBeforeDay = results[0];
                        const daily = results[1];

                        if (!daily || sample.dataleft != daily.dataleft) {
                            yield upsert(mapper(sample, lastSampleBeforeDay));
                        }
                    })
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