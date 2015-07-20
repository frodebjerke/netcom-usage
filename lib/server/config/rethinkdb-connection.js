const rethinkdbdash = require('rethinkdbdash');
const config = require('../../../config');
const logger = require('../../logging/logger');

const r = rethinkdbdash({
    host: config.db.host,
    db: config.db.name
});

module.exports = r;
module.exports.setupDb = function* () {
    logger.info('setup db');
    var dbList = yield r.dbList();

    if (dbList.indexOf(config.db.name) === -1) {
        logger.info('Created db with name: ' + config.db.name);
        yield r.dbCreate(config.db.name);
    }
}
