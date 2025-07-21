/* eslint-disable import/no-extraneous-dependencies */
const WebSocket = require('ws');
const waterQualityService = require('../services/waterQuality.service');

function initWebSocket(server) {
  /* CREATE WSS INSTANCE */
  const wss = new WebSocket.Server(server);

  wss.on('connection', (ws) => {
    console.log('New Client Connected');

    let interval = null;

    /* SEND DATA METHOD */
    const sendData = async () => {
      try {
        /* GET ALL DATA */
        const allSensorData = await waterQualityService.getAll();
        const result = {
          type: 'all_data',
          data: allSensorData.data,
          total_debit_yesterday: allSensorData.total_debit_yesterday,
          total_debit_today: allSensorData.total_debit_today,
        };
        /* SEND VIA WEBSOCKET */
        ws.send(JSON.stringify(result));
      } catch (error) {
        ws.send(JSON.stringify({
          message: 'Error fetching sensor data:', error,
        }));
      }
    };

    const sendLatest = async () => {
      try {
        /* GET ALL DATA */
        const latestSensorData = await waterQualityService.getLatest();
        const result = {
          type: 'latest_data',
          data: latestSensorData.data,
        };
        /* SEND VIA WEBSOCKET */
        ws.send(JSON.stringify(result));
      } catch (error) {
        ws.send(JSON.stringify({
          message: 'Error fetching sensor data:', error,
        }));
      }
    };

    ws.on('message', (message) => {
      try {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === 'all_data') {
          clearInterval(interval);
          sendData();
          interval = setInterval(sendData, 1 * 60 * 1000);
        } else {
          clearInterval(interval);
          sendLatest();
          interval = setInterval(sendLatest, 1 * 60 * 1000);
        }
      } catch (error) {
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
      }
    });

    ws.on('close', () => {
      console.log('Client Disconnectd');
      clearInterval(interval);
    });
  });

  console.log(`WebSocket server initialize on ws://${process.env.HOST}:${process.env.WS_PORT}`);
}

module.exports = {
  initWebSocket,
};
