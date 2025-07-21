/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const sequelize = require('./config/db.config');

require('dotenv').config();

// const waterQualityService = require('./services/waterQuality.service');
const middlewares = require('./middlewares');
const api = require('./api');
const { WaterQuality } = require('./model/WaterQuality');
const { initWebSocket } = require('./socket-gateway/websocket.server');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

/* SEQUELIZE INIT TABLE */
(async () => {
  try {
    await sequelize.authenticate();
    WaterQuality.sync();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

app.use('/api/', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);
initWebSocket({ port: process.env.WS_PORT }); // Init websocket

module.exports = app;
