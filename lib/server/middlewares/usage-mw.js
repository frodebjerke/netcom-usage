const usageRepo = require('../repo/usage');
const co = require('co');
const _ = require('lodash');
const moment = require('moment');

module.exports = {

    index: function (req, res, next) {
        const networkId = req.params.networkId;
        co(usageRepo.getNewestSample(networkId))
        .then(function (freshest) {
            const networkName = freshest.networkId;
            const dataleft = freshest.dataleft + " MB left in period";
            const timeSinceSample = moment(freshest.timestamp).toNow(true);
            res.render('index', { networkName: networkName, dataleft: dataleft, timeSinceSample: timeSinceSample, title: 'Usage ' + networkName });
        })
        .catch(function (error) {
            console.log(error)
            res.render('index', { error: error, title: 'Durp!'});
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
