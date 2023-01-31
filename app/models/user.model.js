module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("Users", {
      userid: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      password: {
        type: Sequelize.STRING
      },
      university: {
        type: Sequelize.STRING,
        allow: true
      }
    }, { timestamps: false });
    return User
  }

