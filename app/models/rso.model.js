module.exports = (sequelize, Sequelize) => {
    const Rso = sequelize.define("Rsos", {
      rsoid: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      adminid: {
        type: Sequelize.STRING,
        allowNull: false
      },
    }, { timestamps: false });
    return Rso
  }