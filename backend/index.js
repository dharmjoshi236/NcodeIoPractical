const express = require('express');
const cors = require('cors');
const { envConstants } = require('./constants/envConstants');
const { connectMySqlDb } = require('./databaseConnection');
const mainRouter = require('./routes/index')

const app = express();

app.use(express.json()); // Body parser
app.use(cors());

app.use("/api", mainRouter);

app.listen(envConstants.serverPort, ()=> {
    connectMySqlDb()
    .then(()=> {
        console.log("DB connected successfully");
    }).catch((e)=> {
        console.log("Unable to connect Db, Try again", e);
    })

    console.log("Server is listening on port ", envConstants.serverPort)
})