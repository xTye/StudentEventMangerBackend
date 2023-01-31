const db = require("../models");
const RsoEvent = db.RsoEvents;
const EventsAt = db.EventsAt;
const Op = db.Sequelize.Op;
const asyncHandler = require("express-async-handler");
const rsoEventModel = require("../models/rsoEvent.model");
const { Admins, Locations, Users } = require("../models");

// Create and Save a new RsoEvent
exports.create = asyncHandler(async (req, res, next) => {
  // Validate request
  if (!req.body.adminid ) {
    res.status(400);
    throw new Error("Content can not be empty!");
  }

  const adminRet = await Admins.findByPk(req.body.adminid);
  if (!adminRet) {
    res.status(400);
    throw new Error("Admin ID is not an admin!");
  }

  var locationObj = await Locations.findOne({ where: { lname: req.body.Location.lname }}).catch(err => {});
  if (!locationObj) {
    locationObj = await Locations.create(req.body.Location);

    if (!locationObj) {
      res.status(400);
      throw new Error("Location could not be created!\n" );
    }
  }

  var eventsAtObj = await EventsAt.findOne({ where: { time: req.body.EventsAt.time, date: req.body.EventsAt.date, location: locationObj.lname } }).catch(err => {});
  if (eventsAtObj) {
    res.status(400);
    throw new Error("Events cannot be at the same time and location!");
  }

  if (!eventsAtObj) {
    eventsAtObj = await EventsAt.create(req.body.EventsAt).catch(err => {});
    
    if (!eventsAtObj) {
      res.status(400);
      throw new Error("Events could not be created!");
    }
  }

  // Create a RsoEvent
  const rsoEvent= {
    eventid: eventsAtObj.eventid,
    adminid: req.body.adminid
  }

  // Save RsoEvent in the database
  const rsoEventObj = await RsoEvent.create(rsoEvent).catch(err => {});

  if (!rsoEventObj) {
    await Users.destroy({ where: {eventid: eventsAtObj.eventid } }).catch(err => {});

    res.status(400);
    throw new Error("Rso event could not be made");
  }

  res.status(200).send({
      eventid: rsoEventObj.eventid,
      adminid: rsoEventObj.adminid,
      EventsAt: { 
        eventid: eventsAtObj.eventid,
        eventname: eventsAtObj.eventname,
        time: eventsAtObj.time,
        date: eventsAtObj.date,
        description: eventsAtObj.description,
        location: eventsAtObj.location,
        category: eventsAtObj.category,
        phonenumber: eventsAtObj.phonenumber,
        emailaddress: eventsAtObj.emailaddress,
        Location: locationObj
      },
      Comments: []
  });
});

/*
// Create and Save a new RsoEvent
exports.create = (req, res) => {
  // Validate request
  if (!req.body.eventid) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a RsoEvent
  const rsoEvent= {
    eventid: req.body.eventid,
    rsoid: req.body.rsoid

  };

  // Save RsoEvent in the database
  RsoEvent.create(rsoEvent)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the RsoEvent."
      });
    });
};
*/
// Retrieve all RsoEvents from the database.
exports.findAll = (req, res) => {
    const eventid = req.query.eventid;
    var condition = eventid ? { eventid: { [Op.like]: `%${eventid}%` } } : null;
    RsoEvent.findAll({ where: condition ,include: [{ all: true, nested: true }]})
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving rsoEvents."
        });
      });
};

// Find a single RsoEvent with a eventid
exports.findOne = (req, res) => {
    const eventid = req.params.eventid;
    RsoEvent.findByPk(eventid, {include: [{ all: true, nested: true }]})
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find RsoEvent with eventid=${eventid}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving RsoEvent with eventid=" + eventid
        });
      });
};

// Update a RsoEvent by the id in the request
exports.update = (req, res) => {
    const eventid = req.params.eventid;
    RsoEvent.update(req.body, {
      where: { eventid: eventid }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "RsoEvent was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update RsoEvent with eventid=${eventid}. Maybe RsoEvent was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating RsoEvent with eventid=" + eventid
        });
      });
};

// Delete a RsoEvent with the specified id in the request
exports.delete = (req, res) => {
    const eventid = req.params.eventid;
    RsoEvent.destroy({
      where: { eventid: eventid }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "RsoEvent was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete RsoEvent with eventid=${eventid}. Maybe RsoEvent was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete RsoEvent with eventid=" + eventid
        });
      });
};

// Delete all RsoEvents from the database.
exports.deleteAll = (req, res) => {
    RsoEvent.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} RsoEvents were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all rsoEvents."
          });
        });
};
