# Express mongodb es6 boilerplate

Boilerplate/Starter Project for building RESTful APIs and microservices using Node.js, Express and MongoDB.

## Getting started

To get the Node server running locally:

- Clone this repo
- `npm install` or `yarn install` to install all required dependencies
- Install MongoDB Community Edition ([instructions](https://docs.mongodb.com/manual/installation/#tutorials)) and run it by executing `mongod`
- `npm run start` to start the local server
- `npm run test` to excute the test cases
- `npm run build` to build the project.


# Code Overview

## Dependencies

- [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [mongoose](https://github.com/Automattic/mongoose) - For modeling and mapping MongoDB data to javascript
- [morgan](https://github.com/expressjs/morgan) - HTTP request logger middleware for node.js
- [http-status](https://github.com/wdavidw/node-http-status) - Utility to interact with HTTP status code.
- [joi](github.com/hapijs/joi) - Object schema description language and validator for JavaScript objects.
- [cors](github.com/expressjs/cors) - CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.

## Application Structure

- environment.js - Projects specific config's are defined here. (Like PORT, Mongo URI, etc..)
- test/ - This folder contains the project test cases.
- src/config  - This folder contains api specific config.
- src/api/routes  - This folder contains the route definitions for our API.
- src/api/controllers  - This folder contains the controllers definitions for our API.
- src/api/models  - This folder contains the schema definitions for our Mongoose models.
- src/api/utils  - This folder contains the utils definitions for our API.
- src/api/middlewares  - This folder contains the middlewares definitions for our API.




