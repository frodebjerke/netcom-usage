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

        co(usageRepo.getUsage())
        .then(function (results) {
            res.send({
                usage: results
            });
        })
        .catch(next);
    }

}
