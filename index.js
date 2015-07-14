var ScrapeSite = require('./lib/scrape-site');
var config = require('./config');

var scraper = new ScrapeSite(config);

scraper.scrape()
    .then((res) => {
        console.log('Data left:', res);
        console.log('Success. Quitting ...');
    })
    .catch((err) => {
        console.log('Catastrophic failure:', err)
        console.log('Script failed to execute. Quitting ...');
    });
