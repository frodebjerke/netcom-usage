module.exports = {
    targetSite: process.env.TARGET_SITE || 'netcom.no/mbb-refill',
    usageLogFile: process.env.USAGE_LOG_FILE || 'usage.log',
    serverUrl: process.env.SERVER_URL || 'localhost:3000',
    serverPort: process.env.PORT || 3000
}
