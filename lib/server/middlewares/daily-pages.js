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
        const prevMonth = start.clone().add(-1, 'months');
        const prevMonthLink = '?month='+prevMonth.month()+'&year='+prevMonth.year();

        var nextMonth, nextMonthLink;
        if (start.month() < moment().month()) {
            nextMonth = start.clone().add(1, 'months');
            logger.info(start.format('MMMM'), start.add(1, 'months').format('MMMM'), nextMonth.format('MMMM'));
            nextMonthLink = '?month='+nextMonth.month()+'&year='+nextMonth.year();
        }

        res.render('daily-history', {
            history: historyVM,
            month: monthName,
            year: year,
            title: "Daily history",
            networkName: networkId,
            prevMonthLink: prevMonthLink,
            prevMonthName: prevMonth.format('MMMM'),
            nextMonthLink: nextMonthLink,
            nextMonthName: nextMonth ? nextMonth.format('MMMM') : null
        })
    })
    .catch(function (err) {
        logger.error('daily history page', err);
        res.render('error');
    })
}
