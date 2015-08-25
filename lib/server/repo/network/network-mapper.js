const moment = require('moment');

exports.defaultConfig = function (networkId) {
    return {
        id: networkId,
        dataplan: 204800,
        created: moment().format(),
        modified: moment().format()
    };
}

exports.sanitize = function (config) {
    return {
        dataplan: parseInt(config.dataplan),
        modified: moment().format()
    }
}
