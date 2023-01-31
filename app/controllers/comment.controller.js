const db = require("../models");
const Comment = db.Comments;
const Op = db.Sequelize.Op;

// Create and Save a new Comment
exports.create = (req, res) => {
  // Validate request
  if (!req.body.eventid) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Comment
  const comment= {
    userid :req.body.userid,
	  eventid :req.body.eventid,
	  text :req.body.text,
	  rating :req.body.rating,
	  timestamp :Date.now()
  };

  // Save Comment in the database
  Comment.create(comment)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Comment."
      });
    });
};

// Retrieve all Comments from the database.
exports.findAll = (req, res) => {
    const eventid = req.query.eventid;
    var condition = eventid ? { eventid: { [Op.like]: `%${eventid}%` } } : null;
    Comment.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving comments."
        });
      });
};

// Find a single Comment with a eventid
exports.findOne = (req, res) => {
    const eventid = req.params.eventid;
    Comment.findByPk(eventid)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find Comment with eventid=${eventid}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Comment with eventid=" + eventid
        });
      });
};

// Update a Comment by the id in the request
exports.update = (req, res) => {
    const eventid = req.params.eventid;
    Comment.update(req.body, {
      where: { eventid: eventid }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Comment was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Comment with eventid=${eventid}. Maybe Comment was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Comment with eventid=" + eventid
        });
      });
};

// Delete a Comment with the specified id in the request
exports.delete = (req, res) => {
    const eventid = req.params.eventid;
    Comment.destroy({
      where: { eventid: eventid }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Comment was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Comment with eventid=${eventid}. Maybe Comment was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Comment with eventid=" + eventid
        });
      });
};

// Delete all Comments from the database.
exports.deleteAll = (req, res) => {
    Comment.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} Comments were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all comments."
          });
        });
};