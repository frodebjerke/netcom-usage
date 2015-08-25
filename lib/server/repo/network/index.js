const r = require('../../config/rethinkdb-connection');
const tables = require('../../config/rethinkdb-tables');
const logger = require('../../../logging/logger');
const mapper = require('./network-mapper');

module.exports.create = function* (networkId) {
    const defaultConfig = mapper.defaultConfig(networkId);
    const res = yield r.table(tables.network).insert(defaultConfig, {returnChanges: true});

    return res;
}

module.exports.get = function (networkId) {
    const res = r.table(tables.network).get(networkId).default(null);

    return res;
}

module.exports.update = function* (networkId, data) {
    const config = mapper.sanitize(data);

    const res = r.table(tables.network).get(networkId).update(config, {returnChanges: true});

    return res;
}
