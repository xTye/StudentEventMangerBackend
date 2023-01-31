const middleware = require("../middleware/authJwt");

module.exports = app => {
    const eventsAt = require("../controllers/eventsAt.controller.js");
    var router = require("express").Router();
    
    // Create a new EventsAt
    router.post("/", middleware.verifyToken, eventsAt.create);

    // Retrieve all EventsAt
    router.get("/", middleware.verifyToken, eventsAt.findAll);

    // Retrieve a single EventsAt with eventid
    router.get("/:eventid", middleware.verifyToken, eventsAt.findOne);

    // Update a EventsAt with eventid
    router.put("/:eventid", middleware.verifyToken, eventsAt.update);

    // Delete a EventsAt with eventid
    router.delete("/:eventid", middleware.verifyToken, eventsAt.delete);

    // Delete all EventsAt
    router.delete("/", middleware.verifyToken, eventsAt.deleteAll);

    app.use('/api/eventsAt', router);
  };