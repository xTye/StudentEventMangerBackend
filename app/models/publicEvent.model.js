module.exports = (sequelize, Sequelize) => {
    const PublicEvent = sequelize.define("PublicEvent", {
      eventid: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      adminid: {
        type: Sequelize.STRING,
        allowNull: false
      },
      superadminid: {
        type: Sequelize.STRING,
        allowNull: false
      },
    }, { timestamps: false });
    return PublicEvent
  }