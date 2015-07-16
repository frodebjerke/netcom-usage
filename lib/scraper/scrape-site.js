var cheerio = require('cheerio');
var request = require('superagent');
var _ = require('lodash');

module.exports.scrape = function* (targetSite) {
    return getPage(targetSite)
        .then(parseDataLeft);
}

function getPage(targetSite) {
    console.log('Fetching: ', targetSite);
    return new Promise((resolve, reject) => {
        request
            .get(targetSite)
            .end(function (err, res) {
                if (err) {
                    console.log('error getting targetSite', err);
                    reject(err);
                }

                if (!res.ok) {
                    console.log('non ok status code getting targetSite', res.statusCode);
                    reject(res.statusCode);
                }

                resolve(res.text);
            })
    });
}

function parseDataLeft(text) {
    console.log('Parsing for data left.');

    const $ = cheerio.load(text);

    const section = $('#quotaform').find('.section').html();
    const allWords = section.split(' ');

    const numerics = _.reduce(allWords, (acc, word, i) => {
        var numeric = parseInt(word);
        if (numeric && allWords[i+1] === 'MB.') {
            return numeric;
        }
        return acc;
    }, NaN);

    return numerics;
}
