const { envConstants } = require('../constants/envConstants');

require('dotenv').config();
module.exports = {
  "development": {
    "username": envConstants.dbUser,
    "password": envConstants.dbPass,
    "database": envConstants.dbName,
    "host": envConstants.dbHost,
    "dialect": envConstants.dbDialect
  },
  "test": {
    "username": envConstants.dbUser,
    "password": envConstants.dbPass,
    "database": envConstants.dbName,
    "host": envConstants.dbHost,
    "dialect": envConstants.dbDialect
  },
  "production": {
    "username": envConstants.dbUser,
    "password": envConstants.dbPass,
    "database": envConstants.dbName,
    "host": envConstants.dbHost,
    "dialect": envConstants.dbDialect
  }
}
