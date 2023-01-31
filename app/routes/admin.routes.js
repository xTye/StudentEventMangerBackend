const middleware = require("../middleware/authJwt");

module.exports = app => {
    const admins = require("../controllers/admin.controller.js");
    var router = require("express").Router();

    // Retrieve all Admins
    router.get("/", middleware.verifySuperAdmin, middleware.verifyToken, admins.findAll);

    // Retrieve a single Admin with adminid
    router.get("/:adminid", middleware.verifyToken, admins.findOne);

    // Update a Admin with adminid
    router.put("/:adminid", middleware.verifySuperAdmin, middleware.verifyToken, admins.update);

    // Delete a Admin with adminid
    router.delete("/:adminid", middleware.verifySuperAdmin, middleware.verifyToken, admins.delete);

    // Delete all Admins
    router.delete("/", middleware.verifyToken, middleware.verifySuperAdmin, admins.deleteAll);

    app.use('/api/admins', router);
  };