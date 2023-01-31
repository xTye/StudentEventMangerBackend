const db = require("../models");
require("dotenv").config();
const User = db.Users;
const Admin = db.Admins;
const SuperAdmin = db.SuperAdmins;
const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

// DONT FUCK WITH THIS SHIT
exports.signup = asyncHandler(async (req, res, next) => {
  // Check empty
  if (!req.body.userid || !req.body.password) {
    res.status(400)
    throw new Error("Content can not be empty!");
  }

  // Check exists
  const userExists = await User.findOne({
    where: { userid: req.body.userid }
  }).catch(err => {});

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  var secret = req.body.secret ? req.body.secret : null;

  var admin = false;
  var superAdmin = false;

  if (secret) {
    if (await bcrypt.compare(secret, process.env.SECRET_ADMIN_KEY_HASH)){
      admin = true;
    } else if (await bcrypt.compare(secret, process.env.SECRET_SUPERADMIN_KEY_HASH)){
      superAdmin = true;
    } else {
      res.status(400)
      throw new Error("Nice try, but you are not a admin.");
    }
  }

  const salt = await bcrypt.genSalt(8);
  const password = await bcrypt.hash(req.body.password, salt);

  const user = {
    userid: req.body.userid,
    password: password,
    university: null
  };

  // Save User to Database
  const userObj = await User.create(user).catch(err => {});

  if (!userObj) {
    res.status(400);
    throw new Error("User could not be created!");
  }

  if (admin) {
    // Save User to Database
    const adminObj = await Admin.create({
      adminid: userObj.userid,
    }).catch(err => {});
    if (!adminObj) {
      res.status(400);
      throw new Error("Failed to create admin");
    }
  }

  if (superAdmin) {
    // Save User to Database
    const superAdminObj = await SuperAdmin.create({
      superadminid: userObj.userid,
    }).catch(err => {});
    if (!superAdminObj) {
      res.status(400);
      throw new Error("Failed to create superadmin");
    }
  }

  res.status(200).json({ message: "User was registered successfully!" });

});

exports.signin = asyncHandler(async (req, res, next) => {
  const { userid, password } = req.body;
  // Check empty
  if (!userid || !password) {
    res.status(400);
    throw new Error("Content can not be empty!");
  }

  const userObj = await User.findOne({ where: { userid } }).catch(err => {});

  if (!userObj) {
    res.status(400);
    throw new Error("User doesn't exist");
  }
  
  const passwordIsValid = bcrypt.compareSync(
    password,
    userObj.password
  );

  if (!passwordIsValid) {
    req.status(401);
    throw new Error("Password is not valid!");
  }

  const admin = await Admin.findOne({
    where: {
      adminid: userid
    }
  }).catch(err => {});

  const superAdmin = await SuperAdmin.findOne({
    where: {
      superadminid: userid
    }
  }).catch(err => {});

  var token;

  if (admin) {
    token = jwt.sign({ id: userid, type: "admin" }, process.env.SECRET_JWT, {
      expiresIn: "30d" // 30 days
    });
  } else if (superAdmin) {
    token = jwt.sign({ id: userid, type: "superadmin" }, process.env.SECRET_JWT, {
      expiresIn: "30d" // 30 days
    });
  } else {
    token = jwt.sign({ id: userid, type: "user" }, process.env.SECRET_JWT, {
      expiresIn: "30d" // 30 days
    });
  }

  res.status(200).send({
    userid: userObj.userid,
    accessToken: token
  });
});

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
    const userid = req.query.userid;
    var condition = userid ? { userid: { [Op.like]: `%${userid}%` } } : null;
    User.findAll({attributes:['userid','createdAt','updatedAt']},{ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving users."
        });
      });
};

// Find a single User with a userid
exports.findOne = (req, res) => {
    const userid = req.params.userid;
    User.findByPk(userid,{attributes:['userid','createdAt','updatedAt']})
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find User with userid=${userid}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving User with userid=" + userid
        });
      });
};

// Update a User by the id in the request
exports.update = (req, res) => {
  if(req.body.password){
    req.body.password = bcrypt.hashSync(req.body.password, 8)
    }
    const userid = req.params.userid;
    User.update(req.body, {
      where: { userid: userid }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "User was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update User with userid=${userid}. Maybe User was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating User with userid=" + userid
        });
      });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
    const userid = req.params.userid;
    User.destroy({
      where: { userid: userid }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "User was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete User with userid=${userid}. Maybe User was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete User with userid=" + userid
        });
      });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
    User.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.status(200).send({ message: `${nums} Users were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all users."
          });
        });
};