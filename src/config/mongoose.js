import mongoose from 'mongoose';

// set mongoose Promise to Bluebird
mongoose.Promise = global.Promise;

// Exit application on error
mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
    process.exit(-1);
});

/**
* Connect to mongo db
*
* @returns {object} Mongoose connection
* @public
*/
exports.connect = (envConfig, env) => {
    // print mongoose logs in dev env
    if (env === 'development') {
        mongoose.set('debug', true);
    }
    mongoose.connect(envConfig.mongoUri);
    return mongoose.connection;
};