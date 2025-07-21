const express = require('express');

const waterQuality = require('./waterQuality');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - SPARING LOCAL',
  });
});

router.use('/water-quality', waterQuality);

module.exports = router;
