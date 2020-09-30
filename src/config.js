module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: (process.env.NODE_ENV === 'production')
    ? process.env.DATABASE_URL
    : process.env.LOCAL_DATABASE_URL,
  JWT_SECRET: "secret",
  JWT_EXPIRY: '24h',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL,
  API_TOKEN: process.env.API_TOKEN,
}

//CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:3000"