module.exports = (sequelize, Sequelize) => {
    const UniversitiesCreated = sequelize.define("UniversitiesCreated", {
        name: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      location: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      description: {
        type: Sequelize.TIME,
      },
      numstudents: {
        type: Sequelize.INTEGER,
        unique: true
      },
      superadminid: {
        type: Sequelize.STRING
      } 
    },{
      timestamps: false,
      tableName: "UniversitiesCreated"
    });
    return UniversitiesCreated
  }