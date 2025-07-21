// eslint-disable-next-line import/no-extraneous-dependencies
const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

const WaterQuality = db.define(`${process.env.TABLE_NAME}`, {
  id: {
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  unixtime: {
    allowNull: false,
    type: DataTypes.STRING(20),
    defaultValue: '',
  },
  time: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  ph: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  cod: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  tss: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  nh3n: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  debit: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 0,
  },
  debit2: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  stat_conn: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 0,
  },
  feedback: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
}, {
  freezeTableName: true,
  timestamps: false,
});

module.exports = {
  WaterQuality,
};
