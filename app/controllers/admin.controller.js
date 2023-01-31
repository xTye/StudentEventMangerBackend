const db = require("../models");
const Admin = db.Admins;
const Op = db.Sequelize.Op;

// Create and Save a new Admin
exports.create = (req, res) => {
  // Validate request
  if (!req.body.adminid) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Admin
  const admin= {
    adminid: req.body.adminid

  };

  // Save Admin in the database
  Admin.create(admin)
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Admin."
      });
    });
};

// Retrieve all Admins from the database.
exports.findAll = (req, res) => {
    const adminid = req.query.adminid;
    var condition = adminid ? { adminid: { [Op.like]: `%${adminid}%` } } : null;
    Admin.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving admins."
        });
      });
};

// Find a single Admin with a adminid
exports.findOne = (req, res) => {
    const adminid = req.params.adminid;
    Admin.findByPk(adminid)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find Admin with adminid=${adminid}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Admin with adminid=" + adminid
        });
      });
};

// Update a Admin by the id in the request
exports.update = (req, res) => {
    const adminid = req.params.adminid;
    Admin.update(req.body, {
      where: { adminid: adminid }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Admin was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Admin with adminid=${adminid}. Maybe Admin was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Admin with adminid=" + adminid
        });
      });
};

// Delete a Admin with the specified id in the request
exports.delete = (req, res) => {
    const adminid = req.params.adminid;
    Admin.destroy({
      where: { adminid: adminid }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Admin was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Admin with adminid=${adminid}. Maybe Admin was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Admin with adminid=" + adminid
        });
      });
};

// Delete all Admins from the database.
exports.deleteAll = (req, res) => {
    Admin.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} Admins were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all admins."
          });
        });
};