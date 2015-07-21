const usageRepo = require('../repo/usage');
const co = require('co');

module.exports = {

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
