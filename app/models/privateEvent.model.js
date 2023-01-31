module.exports = (sequelize, Sequelize) => {
    const PrivateEvent = sequelize.define("PrivateEvent", {
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
    return PrivateEvent
  }