module.exports = (sequelize, Sequelize) => {
    const Admin = sequelize.define("Admins", {
      adminid: {
        type: Sequelize.STRING,
        primaryKey: true
      },
    }, { timestamps: false } );
    
    return Admin;
  }