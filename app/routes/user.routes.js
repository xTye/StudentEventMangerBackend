const middleware = require("../middleware/authJwt");

module.exports = app => {
    const users = require("../controllers/user.controller.js");
    var router = require("express").Router();

    // Retrieve all Users
    router.get("/", middleware.verifySuperAdmin, middleware.verifyToken, users.findAll);

    // Retrieve a single User with userid
    router.get("/:userid", middleware.verifySuperAdmin, middleware.verifyToken, users.findOne);

    // Update a User with userid
    router.put("/:userid", middleware.verifyToken, users.update);

    // Delete a User with userid
    router.delete("/:userid", middleware.verifyToken, users.delete);

    // Delete all Users
    router.delete("/", middleware.verifySuperAdmin, middleware.verifyToken, users.deleteAll);

    router.post("/signup", users.signup);
    router.post("/signin", users.signin);

    router.get("/verify", middleware.verifyToken);

    app.use('/api/users', router);
  };