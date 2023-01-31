const middleware = require("../middleware/authJwt");

module.exports = app => {
    const superAdmins = require("../controllers/superAdmin.controller.js");
    var router = require("express").Router();

    // Retrieve all SuperAdmins
    router.get("/", middleware.verifySuperAdmin, middleware.verifyToken, superAdmins.findAll);

    // Retrieve a single SuperAdmin with superadminid
    router.get("/:superadminid", middleware.verifyToken, superAdmins.findOne);

    // Update a SuperAdmin with superadminid
    router.put("/:superadminid", middleware.verifySuperAdmin, middleware.verifyToken, superAdmins.update);

    // Delete a SuperAdmin with superadminid
    router.delete("/:superadminid", middleware.verifySuperAdmin, middleware.verifyToken, superAdmins.delete);

    // Delete all SuperAdmins
    router.delete("/", middleware.verifySuperAdmin, middleware.verifyToken, superAdmins.deleteAll);

    app.use('/api/superAdmins', router);
  };