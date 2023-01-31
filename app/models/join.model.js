module.exports = (sequelize, Sequelize) => {
    const Join = sequelize.define("Joins", {
      userid: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      rsoid: {
        type: Sequelize.STRING,
        primaryKey: true
      },
    }, { timestamps: false });
    return Join
  }