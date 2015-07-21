var argv = require('yargs').argv;

module.exports = {

    scraper: {
        targetSite: process.env.TARGET_SITE || 'netcom.no/mbb-refill',
        serverUrl: argv.server || process.env.SERVER_URL || 'localhost:3000',
        usageLogFile: argv.usageLog || process.env.USAGE_LOG_FILE || 'usage.log',
        networkId: argv.network || process.env.NETCOM_NETWORKID || 'test'
    },

    server: {
        port: process.env.PORT || 3000
    },

    db: {
        host: process.env.RETHINKDB_HOST || 'localhost',
        port: process.env.RETHINKDB_PORT || 28015,
        name: process.env.RETHINK_NAME || 'netcom_usage'
    }
}
