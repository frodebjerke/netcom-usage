const co = require('co');
const UsageClient = require('./lib/usage-client');
const config = require('./config').scraper;
const _ = require('lodash');
const moment = require('moment');
const request = require('superagent');

const _client = new UsageClient({url: config.serverUrl});

const SIZE = 63 * 24; // 100 days at 1 hours between
const SAMPLE_RATE = 1; // hours between
const PLAN = 200000; // MB plan
const PERIOD_LENGTH = 30 // 30 days period

const gen = getDatapoint();
dataGenerator(gen, 1);

function dataGenerator(gen, i) {
    const hoursBeforeNow = (SIZE - i) * SAMPLE_RATE;
    const data = {
        dataleft: gen.next().value,
        timestamp: moment().subtract(hoursBeforeNow, 'hours').format(),
        networkId: 'test'
    }

    co(_client.send(data))
    .then(function (res) {
        if (i < SIZE) {
            return dataGenerator(gen, ++i);
        }
        console.log('finished! Created:', i);
        return
    })
    .catch(function (error) {
        console.log('Error posting:', i, ' Error:', error);
    });
}



function* getDatapoint() {
    var index = 1;
    var last = PLAN;

    while (true) {
        if (index % (PERIOD_LENGTH * 24) !== 0) {
            const now = last;
            last = last - Math.floor(600 * Math.random());
            if (last < 0) last = 0;
            yield last
        } else {
            console.log('refill!', index, index % (PERIOD_LENGTH*24) )
            last = PLAN - Math.floor(500 * Math.random());
            yield last
        }
        index++
    }
}
