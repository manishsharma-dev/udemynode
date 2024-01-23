const express = require('express');
const app = express();

const dotenv = require('dotenv');

const connectDatabase = require("./config/database");

dotenv.config({ path: './config/config.env' });

connectDatabase(); // connect DB

const jobs = require('./routes/jobs');

app.use('/api/v1', jobs);

const port = process.env.PORT || 3000
app.listen(port || 3000, () => {
    console.log(`listening on port ${port} in ${process.env.NODE_ENV} mode`);
})