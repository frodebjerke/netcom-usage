const express = require('express');
const router = express.Router();
const usageMw = require('../middlewares/usage-mw');
const authMw = require('../middlewares/auth-mw');
const dailyMw = require('../middlewares/daily-mw');

router.get('/:networkId', usageMw.index);

router.get('/usage/:networkId', usageMw.getAll);
router.post('/usage', usageMw.receiveData);

router.post('/daily/rebuild', authMw.ensureAdmin, dailyMw.rebuild);

module.exports = router;
