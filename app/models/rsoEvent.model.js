module.exports = (sequelize, Sequelize) => {
    const RsoEvent = sequelize.define("RsoEvents", {
      eventid: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      rsoid: {
        type: Sequelize.STRING,
        allowNull: false
      },
    }, { timestamps: false });
    return RsoEvent
  }