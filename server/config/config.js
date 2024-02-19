require("dotenv").config({ path: `${__dirname}/../.env` });

module.exports = {
  development: {
    username: process.env.MYSQL_CONFIG_USER,
    password: process.env.MYSQL_CONFIG_PASSWORD,
    database: process.env.MYSQL_CONFIG_DATABASE_DEV,
    host: process.env.MYSQL_CONFIG_HOST,
    dialect: process.env.MYSQL_CONFIG_DIALECT,
  },
  test: {
    username: process.env.MYSQL_CONFIG_USER,
    password: process.env.MYSQL_CONFIG_PASSWORD,
    database: process.env.MYSQL_CONFIG_DATABASE_TEST,
    host: process.env.MYSQL_CONFIG_HOST,
    dialect: process.env.MYSQL_CONFIG_DIALECT,
  },
  production: {
    username: process.env.MYSQL_CONFIG_USER,
    password: process.env.MYSQL_CONFIG_PASSWORD,
    database: process.env.MYSQL_CONFIG_DATABASE_PROD,
    host: process.env.MYSQL_CONFIG_HOST,
    dialect: process.env.MYSQL_CONFIG_DIALECT,
  },
};