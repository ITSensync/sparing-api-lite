/* eslint-disable global-require */
/* eslint-disable no-use-before-define */
/* eslint-disable import/no-extraneous-dependencies */
// const { default: axios } = require('axios');
const moment = require('moment');
const { Op } = require('sequelize');
const { WaterQuality } = require('../model/WaterQuality');

async function getAll() {
  try {
    const today = new Date();
    const todayFormatted = new Date(today.getTime() + 7 * 60 * 60 * 1000) // Menyesuaikan ke GMT+7
      .toISOString()
      .split('T')[0];
    const yesterday = new Date(today.getTime() + 7 * 60 * 60 * 1000 - 24 * 60 * 60 * 1000);
    const yesterdayFormatted = yesterday.toISOString().split('T')[0];

    // SET START AND END TIME WITH INDONESIA TIME
    const todayStart = `${todayFormatted}T00:00:00Z`;
    const todayEnd = `${todayFormatted}T23:59:59Z`;
    const yesterdayStart = `${yesterdayFormatted}T00:00:00Z`;
    const yesterdayEnd = `${yesterdayFormatted}T23:59:59Z`;

    // GET ALL DATA WITH BEETWEEN START AND END DATETIME
    const result = await WaterQuality.findAll({
      attributes: [
        'id', 'ids', 'unixtime', 'ph',
        'cod', 'tss', 'nh3n', 'debit',
        'diff_debit', 'rs_stat', 'status_2m', 'status_1h',
        'feedback', 'createdAt'],
      where: {
        createdAt: {
          [Op.between]: [todayStart, todayEnd],
        },
      },
      order: [
        ['unixtime', 'asc'],
      ],
    });

    const resultToday = await WaterQuality.findAll({
      attributes: [
        'id', 'debit',
        'diff_debit', 'createdAt'],
      where: {
        createdAt: {
          [Op.between]: [todayStart, todayEnd],
        },
      },
      order: [
        ['unixtime', 'asc'],
      ],
    });

    const resultYesterday = await WaterQuality.findAll({
      attributes: [
        'id', 'debit',
        'diff_debit', 'createdAt'],
      where: {
        createdAt: {
          [Op.between]: [yesterdayStart, yesterdayEnd],
        },
      },
      order: [
        ['unixtime', 'asc'],
      ],
    });

    if (!result || !resultYesterday || !resultToday) {
      // eslint-disable-next-line no-throw-literal
      throw {
        status: 400,
        message: 'Failed get all data!',
      };
    }

    /* GET YESTERDAY DEBIT DATA */
    const yesterdayDebitResult = resultYesterday.filter((record) => {
      const createdAt = moment(record.createdAt);
      return createdAt.isBetween(yesterdayStart, yesterdayEnd, null, []);
    });

    /* GET TODAY DEBIT DATA */
    const todayDebitResult = resultToday.filter((record) => {
      const createdAt = moment(record.createdAt);
      return createdAt.isBetween(todayStart, todayEnd, null, []);
    });

    /* COUND TOTAL DEBIT YESTERDAY */
    // eslint-disable-next-line max-len
    const total_debit_yesterday = yesterdayDebitResult.reduce((sum, record) => sum + (record.diff_debit || 0), 0);

    /* COUND TOTAL DEBIT TODAY */
    // eslint-disable-next-line max-len
    const total_debit_today = todayDebitResult.reduce((sum, record) => sum + (record.diff_debit || 0), 0);

    return {
      status: 200,
      data: result,
      total_debit_yesterday: Math.round(total_debit_yesterday * 100) / 100,
      total_debit_today: Math.round(total_debit_today * 100) / 100,
    };
  } catch (error) {
    console.log(error.message);
    return {
      status: error.status || 500,
      message: error.message,
    };
  }
}

async function getOne(unixtime) {
  try {
    /* GET ONE DATA BY UNIXTIME */
    const result = await WaterQuality.findOne({
      attributes: [
        'id', 'ids', 'unixtime', 'ph',
        'cod', 'tss', 'nh3n', 'debit',
        'diff_debit', 'rs_stat', 'status_2m', 'status_1h',
        'feedback', 'createdAt'],
      where: { unixtime },
    });

    if (!result) {
      // eslint-disable-next-line no-throw-literal
      throw {
        status: 404,
        message: `Data not found with time: ${unixtime}!`,
      };
    }

    return {
      status: 200,
      message: 'Success get data',
      data: result,
    };
  } catch (error) {
    console.log(error.message);
    return {
      status: error.status || 500,
      message: error.message,
    };
  }
}

async function getLatest() {
  try {
    const minutesAgo = new Date();
    minutesAgo.setSeconds(0, 0);
    minutesAgo.setHours(minutesAgo.getHours() + 7);
    minutesAgo.setMinutes(minutesAgo.getMinutes() - 3);

    const response = await WaterQuality.findOne({
      where: {
        createdAt: {
          [Op.gte]: minutesAgo,
        },
      },
      order: [
        ['unixtime', 'desc'],
      ],
    });

    if (!response) {
      // eslint-disable-next-line no-throw-literal
      throw {
        status: 404,
        message: 'LATEST DATA NOT FOUND',
      };
    }

    return {
      status: 200,
      data: response,
    };
  } catch (error) {
    console.error(error);
    return {
      status: error.status || 500,
      message: error.message,
    };
  }
}

module.exports = {
  getAll,
  getLatest,
  getOne,
};
