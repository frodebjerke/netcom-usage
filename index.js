const co = require('co');
const scraper = require('./lib/scraper');
const log = require('./lib/logging');
const config = require('./config');

co(function* () {
    console.log('STEP 1: Fetch and extract');
    const dataleft = yield scraper.scrape(config.targetSite);
    return {dataleft: dataleft};
})
.then(function (res) {
    console.log('STEP 2: Log to file');
    const usageLogger = log.getUsageLogger(config.usageLogFile);
    usageLogger(res.dataleft + 'MB left', res);
    return res;
})
.then(function (res) {
    console.log('Success:', res);
})
.catch(function (error) {
    console.log('Failure:', error);
});
