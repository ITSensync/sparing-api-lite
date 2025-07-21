// eslint-disable-next-line import/no-extraneous-dependencies
const { default: axios } = require('axios');

async function checkInternet() {
  try {
    // check google for connection
    await axios.get('https://www.google.com');
    return {
      message: 'Internet connection is available.',
      status: 200,
    };
  } catch (error) {
    return {
      status: 500,
      message: 'No internet connection.',
      error: error.message,
    };
  }
}
module.exports = {
  checkInternet,
};
