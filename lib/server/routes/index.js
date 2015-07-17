const express = require('express');
const router = express.Router();

router.post('/usage', (req, res) => {
    console.log('req-body', req.body, req.query);
    res.send(200);
});

module.exports = router;
