const express = require('express');
const router = express.Router();
const networkPage = require('../middlewares/network-page');
const dailyPages = require('../middlewares/daily-pages');
const usageMw = require('../middlewares/usage-mw');
const authMw = require('../middlewares/auth-mw');
const dailyMw = require('../middlewares/daily-mw');
const networkMw = require('../middlewares/network-mw');

router.get('/:networkId', networkPage.index);
router.get('/:networkId/daily-history', dailyPages.history);

router.get('/usage/:networkId', usageMw.getAll);
router.post('/usage', usageMw.receiveData);


router.post('/daily/rebuild', authMw.ensureAdmin, dailyMw.rebuild);

router.post('/networks/:networkId', networkMw.update); // using post for convenience with the html standard.

module.exports = router;
