// DB Creds
// NcodeUser -> DharmJoshi@1911 -> localhost
const { Sequelize } = require("sequelize");
const { envConstants } = require("./constants/envConstants");

let connectionInstance = new Sequelize(
    {
      database: envConstants.dbName,
      username: envConstants.dbUser,
      password: envConstants.dbPass,
      host: envConstants.dbHost,
      dialect: envConstants.dbDialect,
    }
  );
const connectMySqlDb = async () => {
  try {
    await connectionInstance.authenticate();
  } catch (error) {
    console.log("Unable to connect db, Try again ", error);
    throw new Error(
        "Unable to connect to DB, Try again"
    )
  }
};

module.exports = {
    connectMySqlDb,
    connectionInstance,
}