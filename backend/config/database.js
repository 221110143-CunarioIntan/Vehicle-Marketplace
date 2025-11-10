const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('used_vehicles', 'postgres', 'Ajyh5842', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
  logging: false, // Matikan logging jika tidak perlu
});

module.exports = sequelize;