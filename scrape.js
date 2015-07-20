const co = require('co');
const scraper = require('./lib/scraper');
const log = require('./lib/logging');
const config = require('./config').scraper;
const UsageClient = require('./lib/usage-client');
const logger = require('./lib/logging/logger');
const infoLogger = logger.info;
const errorLogger = logger.error;

co(function* () {
    infoLogger('STEP 1: Fetch and extract');
    const dataleft = yield scraper.scrape(config.targetSite);
    return {dataleft: dataleft};
})
.then(function (res) {
    infoLogger('STEP 2: Log to file');
    const usageLogger = log.getUsageLogger(config.usageLogFile);
    usageLogger(res.dataleft + 'MB left', res);
    return res;
})
.then(function (res) {
    infoLogger('STEP 3: Post to server');
    return co(function* () {
        const _client = new UsageClient({url: config.serverUrl});
        yield _client.send(res);
    });
})
.then(function (res) {
    infoLogger('Success:', res);
})
.catch(function (error) {
    errorLogger('Failure:', error);
});
