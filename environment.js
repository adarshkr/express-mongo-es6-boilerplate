module.exports = {
  development: {
    port: 4000, // assign your own port no
    mongoUri: 'mongodb://localhost/dbname',
    logs: 'dev'
  },
  production: {
    port: 3000, // assign your own port no
    mongoUri: 'mongodb://localhost/dbname',
    logs: 'combined'
  },
  test: {
    port: 3000, // assign your own port no
    mongoUri: 'mongodb://localhost/dbname',
    logs: 'dev'
  }
};

