const middleware = require("../middleware/authJwt");

module.exports = app => {
    const rsoEvents = require("../controllers/rsoEvent.controller.js");
    var router = require("express").Router();
    
    // Create a new RsoEvent
    router.post("/", middleware.verifyAdmin, middleware.verifyToken, rsoEvents.create);

    // Retrieve all RsoEvents
    router.get("/", middleware.verifyEither, middleware.verifyToken, rsoEvents.findAll);

    // Retrieve a single RsoEvent with eventid
    router.get("/:eventid", middleware.verifyEither, middleware.verifyToken, rsoEvents.findOne);

    // Update a RsoEvent with eventid
    router.put("/:eventid", middleware.verifyEither, middleware.verifyToken, rsoEvents.update);

    // Delete a RsoEvent with eventid
    router.delete("/:eventid", middleware.verifyEither, middleware.verifyToken, rsoEvents.delete);

    // Delete all RsoEvents
    router.delete("/", middleware.verifySuperAdmin, middleware.verifyToken, rsoEvents.deleteAll);

    app.use('/api/rsoEvents', router);
  };