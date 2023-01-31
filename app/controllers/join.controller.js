const db = require("../models");
const Join = db.Joins;
const Op = db.Sequelize.Op;
const asyncHandler = require("express-async-handler");
const Rso = db.Rsos;

// Create and Save a new Join
exports.create = asyncHandler( async (req, res, next) => {
  const { userid, rsoid } = req.body;
  // Validate request
  if (!userid && !rsoid) {
    res.status(400);
    throw new Error("Content can not be empty!");
  }

  var rsoObj = await Rso.findOne({ where: { rsoid } }).catch(err => {});
  if (!rsoObj) {
    res.status(400);
    throw new Error("Rso doesn't exist!");
  }
  
  // Create a Join
  const join = {
    userid,
    rsoid
  };

  var joinObj = await Join.findOne({ where: { userid, rsoid } }).catch(err => {});
  if (joinObj) {
    res.status(400);
    throw new Error("You are a member of this Rso");
  }

  if (!joinObj) {
    joinObj = await Join.create(join).catch(err => {});
    
    if (!joinObj) {
      res.status(400);
      throw new Error("Could not join Rso!");
    }
  }
  
  // Save Join in the database
  res.status(200).send(joinObj)
});

// Retrieve all Joins from the database.
exports.findAll = (req, res) => {
    const userid = req.query.userid;
    var condition = userid ? { userid: { [Op.like]: `%${userid}%` } } : null;
    Join.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving joins."
        });
      });
};

// Find a single Join with a userid
exports.findOne = (req, res) => {
    const userid = req.params.userid;
    Join.findByPk(userid)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find Join with userid=${userid}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Join with userid=" + userid
        });
      });
};

// Update a Join by the id in the request
exports.update = (req, res) => {
    const userid = req.params.userid;
    Join.update(req.body, {
      where: { userid: userid }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Join was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Join with userid=${userid}. Maybe Join was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Join with userid=" + userid
        });
      });
};

// Delete a Join with the specified id in the request
exports.delete = (req, res) => {
    const userid = req.params.userid;
    Join.destroy({
      where: { userid: userid }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Join was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Join with userid=${userid}. Maybe Join was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Join with userid=" + userid
        });
      });
};

// Delete all Joins from the database.
exports.deleteAll = (req, res) => {
    Join.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} Joins were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all joins."
          });
        });
};
