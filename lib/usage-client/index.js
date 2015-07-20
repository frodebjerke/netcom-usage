const request = require('superagent');

const Client = function (options) {
    this.url = options.url;
}

Client.prototype.send = function (data) {
    const path = '/usage';
    const url = this.url + path;

    return new Promise((resolve, reject) => {
        request
            .post(url)
            .send(data)
            .set('Content-Type', 'application/json')
            .end((error, res) => {
                if (error) {
                    return reject(error);
                }
                resolve(res.body);
            });
    })
}

module.exports = Client;
