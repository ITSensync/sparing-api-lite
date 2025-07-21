const express = require('express');
const waterQualityController = require('../controller/waterQuality.controller');

const router = express.Router();

/* WATER QUALITY ROUTE */
router.get('/', waterQualityController.getAllData);
router.post('/', waterQualityController.addata);
router.get('/:unixtime', waterQualityController.getOneData);
router.get('/get/latest', waterQualityController.getLatestData);
router.post('/resend', waterQualityController.retrySendData);
router.post('/klhk', waterQualityController.sendToKLHK);
router.put('/:unixtime', waterQualityController.updateData);
router.get('/get/hourly', waterQualityController.get1HourData);
router.get('/get/query', waterQualityController.getAllDataWithQuery);

module.exports = router;
