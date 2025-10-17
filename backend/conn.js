const mongoose = require('mongoose');


const connectDB = async () => {
    try {
        mongoose.connect('mongodb://localhost:27017/training-record2-DB', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => console.log('MongoDB connected to', `${mongoose.connection.host}:${mongoose.connection.port}`))
        .catch(err => console.error('MongoDB connection error:', err));
        console.log(mongoose.connection.client.s.options.host);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB;
// Use the User model to perform CRUD operations