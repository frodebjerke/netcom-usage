const co = require('co');
const UsageClient = require('./lib/usage-client');
const config = require('./config').scraper;
const _ = require('lodash');
const moment = require('moment');
const request = require('superagent');

const _client = new UsageClient({url: config.serverUrl});

const SIZE = 30 * 24; // 30 days at 1 hours between
const SAMPLE_RATE = 1; // hours between
const PLAN = 200000; // MB plan

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
        if (true) {
            const now = last;
            last = last - Math.floor(100 * Math.random());
            yield last
        } else {
            last = PLAN;
            yield last
        }
        index++
    }
}
