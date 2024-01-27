const express = require('express');
const app = express();
app.use(express.json());
const dotenv = require('dotenv');
const connectDatabase = require("./config/database");
const errorMiddleware = require('./middlewares/error');
const ErrorHandler = require('./utils/errorhandler');
//Handling uncaught exceptions

process.on('uncaughtException', err => {
    console.log(`Error : ${err.message}`);
    console.log(`Shutting down server due to uncaught exception`);
    process.exit(1);
})

dotenv.config({ path: './config/config.env' });

connectDatabase(); // connect DB


const jobs = require('./routes/jobs');
const auth = require('./routes/auth');

app.use('/api/v1', jobs);
app.use('/api/v1', auth);

app.all('*', (req, res, next) => {
    next(new ErrorHandler(`${req.originalUrl} route not found`, 404));
})

app.use(errorMiddleware) //middleware to handle error

const port = process.env.PORT || 3000
const server = app.listen(port || 3000, () => {
    console.log(`listening on port ${port} in ${process.env.NODE_ENV} mode`);
})

process.on('unhandledRejection', err => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to unhandled promise rejection');
    server.close(() => {
        process.exit(1);
    });
});

