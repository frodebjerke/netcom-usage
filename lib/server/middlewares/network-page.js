const dailyRepo = require('../repo/daily');
const networkRepo = require('../repo/network');
const co = require('co');
const _ = require('lodash');
const moment = require('moment');
const logger = require('../../logging/logger');

module.exports.index = function (req, res, next) {
    const networkId = req.params.networkId;
    co(indexGetData(networkId))
    .then(indexBuildViewModel)
    .then(res.render.bind(res, 'index'))
    .catch(function (error) {
        logger.error('get index', error)
        res.render('error', { error: error, title: 'Error assemblying data for index view.'});
    })
}

function* indexGetData(networkId) {
    const today = moment().startOf('day');
    const yesterday = moment().subtract(1, 'days').startOf('day');
    const oneweekago = moment().subtract(7, 'days').startOf('day');
    const results = yield [
        dailyRepo.get(networkId, today),
        dailyRepo.getRange(networkId, oneweekago.format(), today.format()),
        networkRepo.get(networkId)
    ]

    const networkConfig = results[2]

    if (!networkConfig) {
        networkConfig = yield networkRepo.create(networkId);
    }

    const data = {
        today: results[0],
        lastweek: results[1],
        network: networkConfig
    };

    logger.debug('index data:', data);

    return data;
}

function indexBuildViewModel(data) {

    const networkName = data.today.networkId;
    const dataleft = data.today.dataleft + " MB";
    const timeSinceSample = moment(data.today.timestamp).toNow(true);
    const usedSinceMidnight = data.today.dataUsed + " MB";
    const usedLastWeek = _.map(data.lastweek, (daily) => {
        return {
            used: daily.dataUsed + " MB",
            day: moment(daily.date).format('dddd')
        };
    });

    const viewModel = {
        networkName: networkName,
        dataleft: dataleft,
        usedSinceMidnight: usedSinceMidnight,
        timeSinceSample: timeSinceSample,
        usedLastWeek: usedLastWeek,
        title: 'Usage ' + networkName,
        network: data.network
    };

    logger.debug('index view model:', viewModel);

    return viewModel;
}
