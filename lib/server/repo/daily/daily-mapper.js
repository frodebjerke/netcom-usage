const moment = require('moment');

module.exports = function (sample, lastSampleBefore) {
    const day = moment(sample.timestamp).startOf('day')
    return {
        id: getId(sample.networkId, day),
        date: day.format(),
        dataleft: sample.dataleft,
        networkId: sample.networkId,
        dataUsed: lastSampleBefore.dataleft - sample.dataleft,
        latestSample: sample.id
    }
}

const getId = function (networkId, day) {
    return networkId + ":" + day.format('DDMMYYYY')
}

module.exports.getId = getId;
