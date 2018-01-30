import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';

import environment from '../environment';
import mongoose from './config/mongoose';
import error from './api/middlewares/error';
import routes from './api/routes/';

// getting application environment
const env = process.env.NODE_ENV;

// getting application config based on environment
const envConfig = environment[env];

// setting port value
const PORT = envConfig.port || 3000;

/**
* Express instance
* @public
*/
const app = express();

// open mongoose connection
mongoose.connect(envConfig, env);

// request logging. dev: console | production: file
app.use(morgan(envConfig.logs));

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// mount api routes
app.use('/', routes);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

// listen to requests
app.listen(PORT);

module.exports = app;