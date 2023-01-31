const middleware = require("../middleware/authJwt");

module.exports = app => {
    const privateEvents = require("../controllers/privateEvent.controller.js");
    var router = require("express").Router();
    
    // Create a new PrivateEvent
    router.post("/", middleware.verifyToken, privateEvents.create);

    // Retrieve all PrivateEvents
    router.get("/", middleware.verifyToken, privateEvents.findAll);

    // Retrieve a single PrivateEvent with eventid
    router.get("/:eventid", middleware.verifyEither, middleware.verifyToken, privateEvents.findOne);

    // Update a PrivateEvent with eventid
    router.put("/:eventid", middleware.verifyEither, middleware.verifyToken, privateEvents.update);

    // Delete a PrivateEvent with eventid
    router.delete("/:eventid", middleware.verifyEither, middleware.verifyToken, privateEvents.delete);

    // Delete all PrivateEvents
    router.delete("/", middleware.verifyEither, middleware.verifyToken, privateEvents.deleteAll);

    app.use('/api/privateEvents', router);
  };