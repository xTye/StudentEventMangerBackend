const middleware = require("../middleware/authJwt");

module.exports = app => {
    const rsos = require("../controllers/rso.controller.js");
    var router = require("express").Router();
    
    // Create a new Rso
    router.post("/", middleware.verifyAdmin, middleware.verifyToken, rsos.create);

    // Retrieve all Rsos
    router.get("/", middleware.verifyToken, rsos.findAll);

    // Retrieve a single Rso with rsoid
    router.get("/:rsoid", middleware.verifyToken, rsos.findOne);

    // Update a Rso with rsoid
    router.put("/:rsoid", middleware.verifyToken, rsos.update);

    // Delete a Rso with rsoid
    router.delete("/:rsoid", middleware.verifyEither, middleware.verifyToken, rsos.delete);

    // Delete all Rsos
    router.delete("/", middleware.verifySuperAdmin, middleware.verifyToken, rsos.deleteAll);

    app.use('/api/rsos', router);
  };