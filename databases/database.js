const sequelize = require('sequelize');

const connection = new sequelize('perguntados','root','jonathan12345',{
  host:'localhost',
  dialect: 'mysql'
});
module.exports = connection;