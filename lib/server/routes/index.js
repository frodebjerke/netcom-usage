const express = require('express');
const router = express.Router();
const usageMw = require('../middlewares/usage-mw');

router.get('/usage/:networkId', usageMw.getAll);
router.post('/usage', usageMw.receiveData);

module.exports = router;
