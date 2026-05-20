require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(
  process.env.DB_NAME || 'mophix_studio',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'root',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
  }
);

sequelize.authenticate()
  .then(() => {
    console.log('DB OK');
    process.exit(0);
  })
  .catch((err) => {
    console.error('DB ERROR:', err);
    process.exit(1);
  });
