const db = require("../models");
const EventsAt = db.EventsAt;
const Op = db.Sequelize.Op;

// Create and Save a new EventsAt
exports.create = (req, res) => {
  // Validate request
  if (!req.body.location) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  
  // Create a EventsAt
  const eventsAt= {
    eventname: req.body.eventname,
    time: req.body.time,
    date: req.body.date,
    description: req.body.description,
    location: req.body.location,
    category: req.body.category,
    phonenumber: req.body.phonenumber,
    emailaddress: req.body.emailaddress

  };

  // Save EventsAt in the database
  EventsAt.create(eventsAt)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the EventsAt."
      });
    });
};

// Retrieve all EventsAt from the database.
exports.findAll = (req, res) => {
    const eventid = req.query.eventid;
    var condition = eventid ? { eventid: { [Op.like]: `%${eventid}%` } } : null;
    EventsAt.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving eventsAt."
        });
      });
};

// Find a single EventsAt with a eventid
exports.findOne = (req, res) => {
    const eventid = req.params.eventid;
    EventsAt.findByPk(eventid)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find EventsAt with eventid=${eventid}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving EventsAt with eventid=" + eventid
        });
      });
};

// Update a EventsAt by the id in the request
exports.update = (req, res) => {
    const eventid = req.params.eventid;
    EventsAt.update(req.body, {
      where: { eventid: eventid }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "EventsAt was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update EventsAt with eventid=${eventid}. Maybe EventsAt was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating EventsAt with eventid=" + eventid
        });
      });
};

// Delete a EventsAt with the specified id in the request
exports.delete = (req, res) => {
    const eventid = req.params.eventid;
    EventsAt.destroy({
      where: { eventid: eventid }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "EventsAt was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete EventsAt with eventid=${eventid}. Maybe EventsAt was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete EventsAt with eventid=" + eventid
        });
      });
};

// Delete all EventsAt from the database.
exports.deleteAll = (req, res) => {
    EventsAt.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} EventsAt were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all eventsAt."
          });
        });
};
