const dailyRepo = require('../repo/daily');
const co = require('co');
const logger = require('../../logging/logger');
const moment = require('moment');
const _ = require('lodash');

module.exports.history = function (req, res, next) {
    const networkId = req.params.networkId;

    co(dailyRepo.getAll(networkId))
    .then(function (history) {
        const historyVM = _.map(history, (daily) => {
            daily.date = moment(daily.timestamp).format('dddd MMMM Do YYYY');
            return daily;
        })
        res.render('daily-history', {history: historyVM, title: "Daily history"})
    })
    .catch(function (err) {
        logger.error('daily history page', err);
        res.render('error');
    })
}
