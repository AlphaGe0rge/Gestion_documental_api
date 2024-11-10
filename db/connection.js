const Sequelize = require('sequelize');

const db = new Sequelize('db_proyecto_software', 'root', 'cacapopo1', {
    host: 'localhost',
    dialect: 'mysql',
    // logging: false,
});

module.exports = db;


