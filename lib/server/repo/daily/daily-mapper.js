const moment = require('moment');

module.exports = function (sample, dataUsed) {
    const day = moment(sample.timestamp).startOf('day')
    return {
        id: getId(sample.networkId, day),
        date: day.format(),
        dataleft: sample.dataleft,
        networkId: sample.networkId,
        dataUsed: dataUsed,
        latestSample: sample.id,
        timestamp: sample.timestamp
    }
}

const getId = function (networkId, day) {
    return networkId + ":" + day.format('DDMMYYYY')
}
module.exports.getId = getId;

module.exports.getDataUsed = function (daily, sample, lastSampleBeforeDay) {
    const alreadyUsed = daily ? daily.dataUsed : 0;
    const dataleftBefore = daily ? daily.dataleft : lastSampleBeforeDay.dataleft;

    if (sample.dataleft > dataleftBefore) {
        return alreadyUsed;
    }

    return alreadyUsed + (dataleftBefore - sample.dataleft);
}
