const middleware = require("../middleware/authJwt");

module.exports = app => {
    const joins = require("../controllers/join.controller.js");
    var router = require("express").Router();
    
    // Create a new Join
    router.post("/", middleware.verifyToken, joins.create);

    // Retrieve all Joins
    router.get("/", middleware.verifyToken, joins.findAll);

    // Retrieve a single Join with userid
    router.get("/:userid", middleware.verifyToken, joins.findOne);

    // Update a Join with userid
    router.put("/:userid", middleware.verifyToken, joins.update);

    // Delete a Join with userid
    router.delete("/:userid", middleware.verifyToken, joins.delete);

    // Delete all Joins
    router.delete("/", middleware.verifySuperAdmin, middleware.verifyToken, joins.deleteAll);

    app.use('/api/joins', router);
  };