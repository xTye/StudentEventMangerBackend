const middleware = require("../middleware/authJwt");

module.exports = app => {
    const locations = require("../controllers/location.controller.js");
    var router = require("express").Router();
    
    // Create a new Location
    router.post("/",  middleware.verifySuperAdmin, middleware.verifyToken, locations.create);

    // Retrieve all Locations
    router.get("/", middleware.verifySuperAdmin, middleware.verifyToken, locations.findAll);

    // Retrieve a single Location with lname
    router.get("/:lname", middleware.verifySuperAdmin, middleware.verifyToken, locations.findOne);

    // Update a Location with lname
    router.put("/:lname", middleware.verifySuperAdmin, middleware.verifyToken, locations.update);

    // Delete a Location with lname
    router.delete("/:lname", middleware.verifySuperAdmin, middleware.verifyToken, locations.delete);

    // Delete all Locations
    router.delete("/", middleware.verifySuperAdmin, middleware.verifyToken, locations.deleteAll);

    app.use('/api/locations', router);
  };