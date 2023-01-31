const middleware = require("../middleware/authJwt");

module.exports = app => {
    const comments = require("../controllers/comment.controller.js");
    var router = require("express").Router();
    
    // Create a new Comment
    router.post("/", middleware.verifyToken, comments.create);

    // Retrieve all Comments
    router.get("/", middleware.verifyToken, comments.findAll);

    // Retrieve a single Comment with eventid
    router.get("/:eventid", middleware.verifyToken, comments.findOne);

    // Update a Comment with eventid
    router.put("/:eventid", middleware.verifyToken, comments.update);

    // Delete a Comment with eventid
    router.delete("/:eventid", middleware.verifyToken, comments.delete);

    // Delete all Comments
    router.delete("/", middleware.verifySuperAdmin, middleware.verifyToken, comments.deleteAll);

    app.use('/api/comments', router);
  };