module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define("Comment", {
      userid: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      eventid: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      text: {
        type: Sequelize.STRING
      },
      rating: {
        type: Sequelize.INTEGER
      },
      timestamp: {
        type: Sequelize.DATE
      },
    }, { timestamps: false });
    return Comment
  }