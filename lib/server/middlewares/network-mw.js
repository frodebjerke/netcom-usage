const networkRepo = require('../repo/network');
const co = require('co');
const logger = require('../../logging/logger');

exports.update = function (req, res, next) {
    const networkId = req.params.networkId;
    const config = req.body;

    co(networkRepo.update(networkId, config))
    .then(res.redirect.bind(res,'/' + networkId, 301))
    .catch(next)
}
