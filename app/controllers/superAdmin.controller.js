const db = require("../models");
const SuperAdmin = db.SuperAdmins;
const Op = db.Sequelize.Op;

// Create and Save a new SuperAdmin
exports.create = (req, res) => {
  // Validate request
  if (!req.body.superadminid) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a SuperAdmin
  const superAdmin= {
    superadminid: req.body.superadminid

  };

  // Save SuperAdmin in the database
  SuperAdmin.create(superAdmin)
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the SuperAdmin."
      });
    });
};

// Retrieve all SuperAdmins from the database.
exports.findAll = (req, res) => {
    const superadminid = req.query.superadminid;
    var condition = superadminid ? { superadminid: { [Op.like]: `%${superadminid}%` } } : null;
    SuperAdmin.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving superAdmins."
        });
      });
};

// Find a single SuperAdmin with a superadminid
exports.findOne = (req, res) => {
    const superadminid = req.params.superadminid;
    SuperAdmin.findByPk(superadminid)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find SuperAdmin with superadminid=${superadminid}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving SuperAdmin with superadminid=" + superadminid
        });
      });
};

// Update a SuperAdmin by the id in the request
exports.update = (req, res) => {
    const superadminid = req.params.superadminid;
    SuperAdmin.update(req.body, {
      where: { superadminid: superadminid }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "SuperAdmin was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update SuperAdmin with superadminid=${superadminid}. Maybe SuperAdmin was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating SuperAdmin with superadminid=" + superadminid
        });
      });
};

// Delete a SuperAdmin with the specified id in the request
exports.delete = (req, res) => {
    const superadminid = req.params.superadminid;
    SuperAdmin.destroy({
      where: { superadminid: superadminid }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "SuperAdmin was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete SuperAdmin with superadminid=${superadminid}. Maybe SuperAdmin was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete SuperAdmin with superadminid=" + superadminid
        });
      });
};

// Delete all SuperAdmins from the database.
exports.deleteAll = (req, res) => {
    SuperAdmin.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} SuperAdmins were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all superAdmins."
          });
        });
};