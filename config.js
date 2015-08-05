var argv = require('yargs').argv;

module.exports = {

    scraper: {
        targetSite: process.env.TARGET_SITE || 'netcom.no/mbb-refill',
        serverUrl: argv.server || process.env.SERVER_URL || 'localhost:3000',
        usageLogFile: argv.usageLog || process.env.USAGE_LOG_FILE || 'usage.log',
        logFile: argv.logFile || process.env.LOG_FILE || 'netcom-usage-scraper.log',
        logLevel: argv.logLevel || process.env.LOG_LEVEL || 'info',
        networkId: argv.network || process.env.NETCOM_NETWORKID || 'test'
    },

    server: {
        port: process.env.PORT || 3000,
        adminToken: process.env.ADMIN_TOKEN || 'stupid'
    },

    db: {
        host: process.env.RETHINKDB_HOST || 'localhost',
        port: process.env.RETHINKDB_PORT || 28015,
        name: process.env.RETHINK_NAME || 'netcom_usage'
    }
}
