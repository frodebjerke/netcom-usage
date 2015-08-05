const usageRepo = require('../repo/usage');
const co = require('co');
const _ = require('lodash');
const moment = require('moment');
const logger = require('../../logging/logger');

module.exports = {

    index: function (req, res, next) {
        const networkId = req.params.networkId;
        co(indexGetData(networkId))
        .then(indexBuildViewModel)
        .then(res.render.bind(res, 'index'))
        .catch(function (error) {
            logger.error('get index', error)
            res.render('index', { error: error, title: 'Error assemblying data for index view.'});
        })
    },

    receiveData: function (req, res, next) {
        const data = req.body;

        co(usageRepo.storeUsage(data))
        .then(function (entity) {
            res.send(entity);
        })
        .catch(next);
    },

    getAll: function (req, res, next) {
        const networkId = req.params.networkId;
        const skip = parseInt(req.query.skip) || 0;
        const limit = parseInt(req.query.limit) || 720;

        co(usageRepo.getUsage(networkId, skip, limit))
        .then(function (results) {
            res.send({
                count: results.length,
                usage: results
            });
        })
        .catch(next);
    }

}

function* indexGetData(networkId) {
    const lastMidnight = moment().startOf('day')
    const yesterdayMidnight = moment().subtract(1, 'days').startOf('day')
    const results = yield [
        usageRepo.getNewestSample(networkId),
        usageRepo.getNewestSample(networkId, lastMidnight.format()),
        usageRepo.getNewestSample(networkId, yesterdayMidnight.format())
    ]

    const data = {
        freshest: results[0],
        startOfDay: results[1],
        startOfYesterday: results[2]
    };

    logger.debug('index data:', data);

    return data;
}

function indexBuildViewModel(data) {
    const freshest = data.freshest;
    const networkName = freshest.networkId;
    const dataleft = freshest.dataleft + " MB left in period";
    const timeSinceSample = moment(freshest.timestamp).toNow(true);
    const usedSinceMidnight = (parseInt(data.startOfDay.dataleft) - parseInt(dataleft)) + " MB.";
    const usedYesterday = (parseInt(data.startOfYesterday.dataleft) - parseInt(dataleft)) + " MB.";

    const viewModel = {
        networkName: networkName,
        dataleft: dataleft,
        usedSinceMidnight: usedSinceMidnight,
        usedYesterday: usedYesterday,
        timeSinceSample: timeSinceSample,
        title: 'Usage ' + networkName
    };

    logger.debug('index view model:', viewModel);

    return viewModel;
}
