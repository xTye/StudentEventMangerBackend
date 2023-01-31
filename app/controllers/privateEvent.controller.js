const db = require("../models");
const PrivateEvent = db.PrivateEvents;
const EventsAt = db.EventsAt;
const Op = db.Sequelize.Op;
const asyncHandler = require("express-async-handler");
const privateEventModel = require("../models/privateEvent.model");
const { Admins, SuperAdmins, Locations, Users } = require("../models");

// Create and Save a new PrivateEvent
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

  // Create a PrivateEvent
  const privateEvent= {
    eventid: eventsAtObj.eventid,
    adminid: req.body.adminid,
    superadminid: req.body.superadminid
  }

  // Save PrivateEvent in the database
  const privateEventObj = await PrivateEvent.create(privateEvent).catch(err => {});

  if (!privateEventObj) {
    await Users.destroy({ where: {eventid: eventsAtObj.eventid } }).catch(err => {});

    res.status(400);
    throw new Error("Private event could not be made");
  }

  res.status(200).send({
      eventid: privateEventObj.eventid,
      adminid: privateEventObj.adminid,
      superadminid: privateEventObj.superadminid,
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

// Retrieve all PrivateEvents from the database.
exports.findAll = (req, res) => {
    const eventid = req.query.eventid;
    var condition = eventid ? { eventid: { [Op.like]: `%${eventid}%` } } : null;
    PrivateEvent.findAll({ where: condition ,include: [{ all: true, nested: true }]})
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving privateEvents."
        });
      });
};

// Find a single PrivateEvent with a eventid
exports.findOne = (req, res) => {
    const eventid = req.params.eventid;
    PrivateEvent.findByPk(eventid, {include: [{ all: true, nested: true }]})
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find PrivateEvent with eventid=${eventid}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving PrivateEvent with eventid=" + eventid
        });
      });
};

// Update a PrivateEvent by the id in the request
exports.update = (req, res) => {
    const eventid = req.params.eventid;
    PrivateEvent.update(req.body, {
      where: { eventid: eventid }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "PrivateEvent was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update PrivateEvent with eventid=${eventid}. Maybe PrivateEvent was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating PrivateEvent with eventid=" + eventid
        });
      });
};

// Delete a PrivateEvent with the specified id in the request
exports.delete = (req, res) => {
    const eventid = req.params.eventid;
    PrivateEvent.destroy({
      where: { eventid: eventid }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "PrivateEvent was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete PrivateEvent with eventid=${eventid}. Maybe PrivateEvent was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete PrivateEvent with eventid=" + eventid
        });
      });
};

// Delete all PrivateEvents from the database.
exports.deleteAll = (req, res) => {
    PrivateEvent.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} PrivateEvents were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all privateEvents."
          });
        });
};
