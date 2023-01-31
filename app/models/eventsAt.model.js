module.exports = (sequelize, Sequelize) => {
    const EventsAt = sequelize.define("EventsAt", {
        eventid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      eventname: {
        type: Sequelize.STRING
      },
      time: {
        type: Sequelize.STRING,
        unique: true
      },
      date: {
        type: Sequelize.STRING,
        unique: true
      },
      description: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      category: {
        type: Sequelize.STRING
      },
      phonenumber: {
        type: Sequelize.STRING
      },
      emailaddress: {
        type: Sequelize.STRING
      } 
    },{
      timestamps: false,
      tableName: "EventsAt"
    } );
    return EventsAt
  }