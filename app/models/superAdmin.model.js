module.exports = (sequelize, Sequelize) => {
    const SuperAdmin = sequelize.define("SuperAdmins", {
      superadminid: {
        type: Sequelize.STRING,
        primaryKey: true
      },

    }, { timestamps: false });
    
    return SuperAdmin
  }