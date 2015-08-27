const dailyRepo = require('../repo/daily');
const co = require('co');
const logger = require('../../logging/logger');
const moment = require('moment');
const _ = require('lodash');

module.exports.history = function (req, res, next) {
    const networkId = req.params.networkId;
    const month = req.query.month || moment().month();
    const year = req.query.year || moment().year();

    const start = moment([year, month]);
    const end = moment([year, month]).endOf('month');

    co(dailyRepo.getRange(networkId, start.format(), end.format()))
    .then(function (history) {
        const historyVM = _.map(history, (daily) => {
            daily.date = moment(daily.timestamp).format('dddd D');
            return daily;
        });
        const monthName = start.format('MMMM');
        res.render('daily-history', {history: historyVM, month: month, year: year, title: "Daily history for " + monthName + ', ' + year, networkName: networkId})
    })
    .catch(function (err) {
        logger.error('daily history page', err);
        res.render('error');
    })
}
