module.exports = (sequelize, Sequelize) => {
    const Location = sequelize.define("Locations", {
      lname: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      address: {
        type: Sequelize.STRING
      },
      longitude: {
        type: Sequelize.STRING
      },
      latitude: {
        type: Sequelize.STRING
      },
    }, { timestamps: false });
    return Location
  }
