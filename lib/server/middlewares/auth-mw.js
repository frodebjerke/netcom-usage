const config = require('../../../config').server;

module.exports.ensureAdmin = function (req, res, next) {

    const adminToken = req.get('Authorization')

    if (adminToken !== 'yolo ' + config.adminToken) {
        res.status(401)
        return res.send('Not authorized to do this! Please provide a correct Authorization header.');
    }

    next();
}
