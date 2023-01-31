const middleware = require("../middleware/authJwt");

module.exports = app => {
    const publicEvents = require("../controllers/publicEvent.controller.js");
    var router = require("express").Router();
    
    // Create a new PublicEvent
    router.post("/", middleware.verifyToken, publicEvents.create);

    // Retrieve all PublicEvents
    router.get("/", middleware.verifyToken, publicEvents.findAll);

    // Retrieve a single PublicEvent with eventid
    router.get("/:eventid", middleware.verifyToken, publicEvents.findOne);

    // Update a PublicEvent with eventid
    router.put("/:eventid", middleware.verifyToken, publicEvents.update);

    // Delete a PublicEvent with eventid
    router.delete("/:eventid", middleware.verifyEither, middleware.verifyToken, publicEvents.delete);

    // Delete all PublicEvents
    router.delete("/", middleware.verifySuperAdmin, middleware.verifyToken, publicEvents.deleteAll);

    app.use('/api/publicEvents', router);
  };