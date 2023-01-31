const dbConfig = require("../config/db.config.js");
require("dotenv").config();

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  port: process.env.DB_PORT,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
  logging: true,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Users = require("./user.model.js")(sequelize, Sequelize);
db.SuperAdmins = require("./superAdmin.model.js")(sequelize, Sequelize);
db.Admins = require("./admin.model.js")(sequelize, Sequelize);
db.Locations = require("./location.model.js")(sequelize, Sequelize);
db.EventsAt = require("./eventsAt.model.js")(sequelize, Sequelize);
db.PrivateEvents = require("./privateEvent.model.js")(sequelize, Sequelize);
db.PublicEvents = require("./publicEvent.model.js")(sequelize, Sequelize);
db.RsoEvents = require("./rsoEvent.model.js")(sequelize, Sequelize);
db.Rsos = require("./rso.model.js")(sequelize, Sequelize);
db.Comments = require("./comment.model.js")(sequelize, Sequelize);
db.Joins = require("./join.model.js")(sequelize, Sequelize);
db.UniversitiesCreated = require("./universitiesCreated.model.js")(sequelize, Sequelize);

db.PublicEvents.belongsTo(db.EventsAt ,{
  foreignKey: 'eventid'
});
db.PrivateEvents.belongsTo(db.EventsAt ,{
  foreignKey: 'eventid'
});
db.RsoEvents.belongsTo(db.EventsAt ,{
  foreignKey: 'eventid'
});

db.PrivateEvents.hasMany(db.Comments,{
  foreignKey: 'eventid'
});

db.PublicEvents.hasMany(db.Comments,{
  foreignKey: 'eventid'
});

db.RsoEvents.hasMany(db.Comments,{
  foreignKey: 'eventid'
});

db.EventsAt.belongsTo(db.Locations,{
  sourceKey:'lname', foreignKey: "location"
});

db.Users.hasMany(db.Comments,{
  foreignKey: 'userid'
});

module.exports = db;