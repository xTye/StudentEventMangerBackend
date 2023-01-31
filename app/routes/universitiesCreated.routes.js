const middleware = require("../middleware/authJwt");

module.exports = app => {
    const universitiesCreated = require("../controllers/universitiesCreated.controller.js");
    var router = require("express").Router();
    
    // Create a new UniversitiesCreated
    router.post("/", middleware.verifySuperAdmin, middleware.verifyToken, universitiesCreated.create);

    // Retrieve all UniversitiesCreated
    router.get("/", middleware.verifySuperAdmin, middleware.verifyToken, universitiesCreated.findAll);

    // Retrieve a single UniversitiesCreated with name
    router.get("/:name", middleware.verifySuperAdmin, middleware.verifyToken, universitiesCreated.findOne);

    // Update a UniversitiesCreated with name
    router.put("/:name", middleware.verifySuperAdmin, middleware.verifyToken, universitiesCreated.update);

    // Delete a UniversitiesCreated with name
    router.delete("/:name", middleware.verifySuperAdmin, middleware.verifyToken, universitiesCreated.delete);

    // Delete all UniversitiesCreated
    router.delete("/", middleware.verifySuperAdmin, middleware.verifyToken, universitiesCreated.deleteAll);

    app.use('/api/universitiesCreated', router);
  };