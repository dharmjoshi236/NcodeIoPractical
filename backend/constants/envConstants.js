require('dotenv').config();

const envConstants = {
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    dbPass: process.env.DB_PASS,
    dbDialect: process.env.DB_DIALECT,
    dbUser: process.env.DB_USER,
    serverPort: process.env.PORT,
    fromEmail: process.env.EMAIL_USER,
    emailAuth: process.env.EMAIL_PASS,
}

module.exports = {
    envConstants
}