const db = require("../models");
const UniversitiesCreated = db.UniversitiesCreated;
const Op = db.Sequelize.Op;

// Create and Save a new UniversitiesCreated
exports.create = (req, res) => {
  // Validate request
  if (!req.body.location) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  
  // Create a UniversitiesCreated
  const universitiesCreated= {
    name: req.body.name,
    location: req.body.name,
    description: req.body.description,
    numstudents: req.body.numstudents,
    superadminid: req.body.superadminid

  };

  // Save UniversitiesCreated in the database
  UniversitiesCreated.create(universitiesCreated)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the UniversitiesCreated."
      });
    });
};

// Retrieve all UniversitiesCreated from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
    UniversitiesCreated.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving universitiesCreated."
        });
      });
};

// Find a single UniversitiesCreated with a name
exports.findOne = (req, res) => {
    const name = req.params.name;
    UniversitiesCreated.findByPk(name)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find UniversitiesCreated with name=${name}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving UniversitiesCreated with name=" + name
        });
      });
};

// Update a UniversitiesCreated by the id in the request
exports.update = (req, res) => {
    const name = req.params.name;
    UniversitiesCreated.update(req.body, {
      where: { name: name }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "UniversitiesCreated was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update UniversitiesCreated with name=${name}. Maybe UniversitiesCreated was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating UniversitiesCreated with name=" + name
        });
      });
};

// Delete a UniversitiesCreated with the specified id in the request
exports.delete = (req, res) => {
    const name = req.params.name;
    UniversitiesCreated.destroy({
      where: { name: name }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "UniversitiesCreated was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete UniversitiesCreated with name=${name}. Maybe UniversitiesCreated was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete UniversitiesCreated with name=" + name
        });
      });
};

// Delete all UniversitiesCreated from the database.
exports.deleteAll = (req, res) => {
    UniversitiesCreated.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} UniversitiesCreated were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all universitiesCreated."
          });
        });
};
