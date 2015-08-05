const co = require('co');
const dailyRepo = require('../repo/daily');

module.exports.rebuild = function (req, res, next) {

    co(dailyRepo.rebuild)
    .then(function () {
        res.send()
    })
    .catch(next);
}
