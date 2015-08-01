const winston = require('winston');
const config = require('../../config').scraper;

const logger = new winston.Logger({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({filename: config.logFile})
    ]
});

logger.level = config.logLevel;

module.exports = logger;
