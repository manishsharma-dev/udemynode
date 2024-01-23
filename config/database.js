const mongoose = require('mongoose');

const connectDatabase = () => {
    mongoose.connect(process.env.DB_URI).then(con => {
        console.log(`Mongoose Connect with ${con.connection.host}`);
    })
}

module.exports = connectDatabase;