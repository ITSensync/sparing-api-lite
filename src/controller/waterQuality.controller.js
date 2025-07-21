const waterQualityService = require('../services/waterQuality.service');

async function getAllData(req, res) {
  const result = await waterQualityService.getAll();
  res.status(result.status).send(result);
}

async function getOneData(req, res) {
  const result = await waterQualityService.getOne(req.params.unixtime);
  res.status(result.status).send(result);
}

async function getLatestData(req, res) {
  const result = await waterQualityService.getLatest();
  res.status(result.status).send(result);
}

async function addata(req, res) {
  const result = await waterQualityService.add(req);
  res.status(result.status).send(result);
}

async function retrySendData(req, res) {
  const result = await waterQualityService.resend();
  res.status(result.status).send(result);
}

async function sendToKLHK(req, res) {
  const result = await waterQualityService.testSendToKLHK(req.body);
  res.status(result.status).send(result);
}

async function updateData(req, res) {
  const result = await waterQualityService.updateData(req.body, req.params.unixtime);
  res.status(result.status).send(result);
}

async function get1HourData(req, res) {
  const result = await waterQualityService.get1Hour();
  res.status(result.status).send(result);
}

async function getAllDataWithQuery(req, res) {
  const result = await waterQualityService.getAllWithQuery(req.query);
  res.status(result.status).send(result);
}

module.exports = {
  retrySendData,
  getAllData,
  getAllDataWithQuery,
  getOneData,
  getLatestData,
  get1HourData,
  addata,
  sendToKLHK,
  updateData,
};
