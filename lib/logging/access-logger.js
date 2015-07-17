const winston = require('winston');

const accessLogger = new winston.Logger({
    levels: {
        access: 0
    },
    transports: [
      new (winston.transports.Console)()
    ]
});

accessLogger.level = 'access';

module.exports = accessLogger;
