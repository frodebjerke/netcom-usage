const r = require('./rethinkdb-connection');
const tables = require('./rethinkdb-tables');

module.exports = function* () {
    yield [
        r.table(tables.usage).indexCreate('timestamp'),
        r.table(tables.usage).indexCreate('networkId')
    ];
}
