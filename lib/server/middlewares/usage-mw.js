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
    }

}
