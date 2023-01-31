const db = require("../models");
const PublicEvent = db.PublicEvents;
const EventsAt = db.EventsAt;
const Op = db.Sequelize.Op;
const asyncHandler = require("express-async-handler");
const publicEventModel = require("../models/publicEvent.model");
const { Admins, SuperAdmins, Locations, Users } = require("../models");

// Create and Save a new PublicEvent
exports.create = asyncHandler(async (req, res, next) => {
  // Validate request
  if (!req.body.adminid || !req.body.superadminid) {
    res.status(400);
    throw new Error("Content can not be empty!");
  }

  const adminRet = await Admins.findByPk(req.body.adminid);
  if (!adminRet) {
    res.status(400);
    throw new Error("Admin ID is not an admin!");
  }
  
  const superadminRet = await SuperAdmins.findByPk(req.body.superadminid);
  if (!superadminRet) {
    res.status(400);
    throw new Error("Superadmin ID is not an admin!");
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

  // Create a PublicEvent
  const publicEvent= {
    eventid: eventsAtObj.eventid,
    adminid: req.body.adminid,
    superadminid: req.body.superadminid
  }

  // Save PublicEvent in the database
  const publicEventObj = await PublicEvent.create(publicEvent).catch(err => {});

  if (!publicEventObj) {
    await Users.destroy({ where: {eventid: eventsAtObj.eventid } }).catch(err => {});

    res.status(400);
    throw new Error("public event could not be made");
  }

  res.status(200).send({
      eventid: publicEventObj.eventid,
      adminid: publicEventObj.adminid,
      superadminid: publicEventObj.superadminid,
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
        Location: locationObj,
      },
      Comments: []
  });
});
/*
// Create and Save a new PublicEvent
exports.create = (req, res) => {
  // Validate request
  if (!req.body.eventid) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a PublicEvent
  const publicEvent= {
    eventid: req.body.eventid,
    adminid: req.body.adminid,
    superadminid: req.body.superadminid
  };

  // Save PublicEvent in the database
  PublicEvent.create(publicEvent)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the PublicEvent."
      });
    });
};
*/
// Retrieve all PublicEvents from the database.
//SELECT `eventid`, `eventname`, `time`, `date`, `description`, `location`, `category`, `phonenumber`, `emailaddress`, `createdAt`, `updatedAt` FROM `EventsAt` AS `EventsAt`;
exports.findAll = async function (req, res) {
    const eventid = req.query.eventid;
    var condition = eventid ? { eventid: { [Op.like]: `%${eventid}%` } } : null;
    PublicEvent.findAll({ where: condition ,include: [{ all: true, nested: true }]})
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving publicEvents."
        });
      });
};

/*
// Retrieve all PublicEvents from the database.
exports.findAll = (req, res) => {
  const eventid = req.query.eventid;
  var condition = eventid ? { eventid: { [Op.like]: `%${eventid}%` } } : null;
  PublicEvent.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving publicEvents."
      });
    });
};
*/

// Find a single PublicEvent with a eventid
exports.findOne = (req, res) => {
    const eventid = req.params.eventid;
    PublicEvent.findByPk(eventid, {include: [{ all: true, nested: true }]})
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find PublicEvent with eventid=${eventid}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving PublicEvent with eventid=" + eventid
        });
      });
};

// Update a PublicEvent by the id in the request
exports.update = (req, res) => {
    const eventid = req.params.eventid;
    PublicEvent.update(req.body, {
      where: { eventid: eventid }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "PublicEvent was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update PublicEvent with eventid=${eventid}. Maybe PublicEvent was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating PublicEvent with eventid=" + eventid
        });
      });
};

// Delete a PublicEvent with the specified id in the request
exports.delete = (req, res) => {
    const eventid = req.params.eventid;
    PublicEvent.destroy({
      where: { eventid: eventid }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "PublicEvent was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete PublicEvent with eventid=${eventid}. Maybe PublicEvent was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete PublicEvent with eventid=" + eventid
        });
      });
};

// Delete all PublicEvents from the database.
exports.deleteAll = (req, res) => {
    PublicEvent.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} PublicEvents were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all publicEvents."
          });
        });
};
