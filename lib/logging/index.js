const winston = require('winston');


module.exports.getUsageLogger = function (filename) {
    const logger = new (winston.Logger)({
        transports: [
            new (winston.transports.File)({filename: filename})
        ],
        levels: {
            dataleft: 0
        }
    });
    logger.level = 'dataleft';
    return logger.dataleft;
}
