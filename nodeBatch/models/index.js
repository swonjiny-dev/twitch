const { Sequelize } = require('sequelize');
const config = require('../config/dbConfig')['database'];
const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.Streamer = require('./streamer')(sequelize, Sequelize);
db.Twitchdailyinfo = require('./twitchDailyInfo')(sequelize, Sequelize);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;