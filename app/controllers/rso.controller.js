const db = require("../models");
const Rso = db.Rsos;
const Op = db.Sequelize.Op;
const asyncHandler = require("express-async-handler");
const Join = db.Joins;

// Create and Save a new Rso
exports.create = asyncHandler(async (req, res, next) => {
  const { rsoid, adminid } = req.body; 
  // Validate request
  if (!rsoid && !adminid) {
    res.status(400);
    throw new Error("Content can not be empty!");
  }

  var rsoObj = await Rso.findOne({ where: { rsoid } });
  if (rsoObj) {
    res.status(400);
    throw new Error("Rso already exists!");
  }

  // Create a Rso
  const rso = {
    rsoid,
    adminid
  };
  
  // Save Rso to database
  rsoObj = await Rso.create(rso).catch(err => {});
  if (!rsoObj) {
    res.status(400);
    throw new Error("Could not create Rso!");
  }

  // Create a Join
  const join = {
    rsoid,
    userid: adminid
  }

  joinObj = await Join.create(join).catch(err => {});
  if (!joinObj) {
    res.status(400);
    throw new Error("Admin wasn't added to joins!");
  }

  res.status(200).send({ rsoObj, joinObj });
});

// Retrieve all Rsos from the database.
exports.findAll = (req, res) => {
    const rsoid = req.query.rsoid;
    var condition = rsoid ? { rsoid: { [Op.like]: `%${rsoid}%` } } : null;
    Rso.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving rsos."
        });
      });
};

// Find a single Rso with a rsoid
exports.findOne = (req, res) => {
    const rsoid = req.params.rsoid;
    Rso.findByPk(rsoid)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find Rso with rsoid=${rsoid}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Rso with rsoid=" + rsoid
        });
      });
};

// Update a Rso by the id in the request
exports.update = (req, res) => {
    const rsoid = req.params.rsoid;
    Rso.update(req.body, {
      where: { rsoid: rsoid }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Rso was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Rso with rsoid=${rsoid}. Maybe Rso was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Rso with rsoid=" + rsoid
        });
      });
};

// Delete a Rso with the specified id in the request
exports.delete = (req, res) => {
    const rsoid = req.params.rsoid;
    Rso.destroy({
      where: { rsoid: rsoid }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Rso was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Rso with rsoid=${rsoid}. Maybe Rso was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Rso with rsoid=" + rsoid
        });
      });
};

// Delete all Rsos from the database.
exports.deleteAll = (req, res) => {
    Rso.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} Rsos were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all rsos."
          });
        });
};
