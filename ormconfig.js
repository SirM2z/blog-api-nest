require('dotenv').config();
const path = require('path');

const entitiesPath =
  process.env.NODE_ENV === 'dist'
    ? path.join(__dirname, '/dist/**/*.entity.js')
    : path.join(__dirname, 'src/**/*.entity.ts');

module.exports = {
  name: 'default',
  type: 'postgres',
  host: process.env.PSQL_HOST,
  port: 5432,
  username: process.env.PSQL_USERNAME,
  password: process.env.PSQL_PASSWORD,
  database: process.env.PSQL_NAME,
  synchronize: true,
  dropSchema: false,
  logging: true,
  entities: [entitiesPath],
};
