require('dotenv').config();
const { DATABASE_URL } = require('./src/config')

module.exports = {
    "migrationDirectory": "migrations",
    "password": '',
    "driver": "pg",
    "connectionString": (process.env.NODE_ENV === 'test')
      ? process.env.TEST_DATABASE_URL
      : DATABASE_URL,
    //"ssl": true,
  }
/*
'postgres://wrpxnebfyculaj:f5229e3f2f950c2bf786b9e3786b9d062e543a929c102d94de5056d4023093e8@ec2-107-22-33-173.compute-1.amazonaws.com:5432/dcu742murmuh29'
 */