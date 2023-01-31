const jwt = require("jsonwebtoken");
require("dotenv").config();
const db = require("../models");
const asyncHandler = require("express-async-handler");


exports.verifyToken = asyncHandler( async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(403)
    throw new Error("No token provided!");
  }

  const bare = String(authorization).split(" ");
  
  if (!bare[0].includes("Bearer")) {
      res.status(403)
      throw new Error("Must begin with bearer");
  }
  
  const token = bare[1];

  jwt.verify(token, process.env.SECRET_JWT, (err, decoded) => {
    if (err) {
       res.status(401)
       throw new Error("Not a valid token!");
    }
    req.userid = decoded.id;
    const type = decoded.type;

    if (req.headers.type == "admin") {
      if (type != "admin") {
        res.status(401);
        throw new Error("Unauthorized");
      }
    }

    if (req.headers.type == "superadmin") {
      if (type != "superadmin") {
        res.status(401);
        throw new Error("Unauthorized");
      }
    }

    if (req.headers.type == "either") {
      if (type != "admin" && type != "superadmin") {
        console.log(type);
        res.status(401);
        throw new Error("Unauthorized");
      }
    }

    if (req.headers.type == "itself") {
      if (decoded.id != req.params.userid) {
        res.status(401);
        throw new Error("Unauthorized");
      }
    }

    next();
  });
});

exports.verifyAdmin = (req, res, next) => {
  req.headers.type = "admin";
  next();
};

exports.verifySuperAdmin = (req, res, next) => {
  req.headers.type = "superadmin";
  next();
};

exports.verifyEither = (req, res, next) => {
  req.headers.type = "either";
  next();
}

exports.isUser = () => {
  req.headers.type = "itself";
  next();
}
