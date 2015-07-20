module.exports = {

    scraper: {
        targetSite: process.env.TARGET_SITE || 'netcom.no/mbb-refill',
        serverUrl: process.env.SERVER_URL || 'localhost:3000',
        usageLogFile: process.env.USAGE_LOG_FILE || 'usage.log'
    },

    server: {
        port: process.env.PORT || 3000
    },

    db: {
        host: process.env.RETHINK_URL || 'localhost',
        name: process.env.RETHINK_NAME || 'netcom_usage'
    }
}
