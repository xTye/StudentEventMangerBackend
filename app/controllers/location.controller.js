const db = require("../models");
const Location = db.Locations;
const Op = db.Sequelize.Op;

// Create and Save a new Location
exports.create = (req, res) => {
  // Validate request
  if (!req.body.lname) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Location
  const location= {
    lname: req.body.lname,
    address: req.body.address,
    longitude: req.body.longitude,
    latitude: req.body.latitude

  };

  // Save Location in the database
  Location.create(location)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Location."
      });
    });
};

// Retrieve all Locations from the database.
exports.findAll = (req, res) => {
    const lname = req.query.lname;
    var condition = lname ? { lname: { [Op.like]: `%${lname}%` } } : null;
    Location.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving locations."
        });
      });
};

// Find a single Location with a lname
exports.findOne = (req, res) => {
    const lname = req.params.lname;
    Location.findByPk(lname)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find Location with lname=${lname}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Location with lname=" + lname
        });
      });
};

// Update a Location by the id in the request
exports.update = (req, res) => {
    const lname = req.params.lname;
    Location.update(req.body, {
      where: { lname: lname }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Location was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Location with lname=${lname}. Maybe Location was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Location with lname=" + lname
        });
      });
};

// Delete a Location with the specified id in the request
exports.delete = (req, res) => {
    const lname = req.params.lname;
    Location.destroy({
      where: { lname: lname }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Location was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Location with lname=${lname}. Maybe Location was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Location with lname=" + lname
        });
      });
};

// Delete all Locations from the database.
exports.deleteAll = (req, res) => {
    Location.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} Locations were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all locations."
          });
        });
};
