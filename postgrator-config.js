require('dotenv').config();
const { DATABASE_URL } = require('./src/config')

module.exports = {
    "migrationDirectory": "migrations",
    "driver": "pg",
    "connectionString": (process.env.NODE_ENV === 'test')
      ? process.env.TEST_DATABASE_URL
      : 'postgres://yhttdkjnivnaon:6814d4f313c85a3d075a92609f64c9a513dad68611fb76bda1ec7d2dd367d38e@ec2-35-173-94-156.compute-1.amazonaws.com:5432/d6vl35rgavo1o',
    "ssl": true,
  }
