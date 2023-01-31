const express = require("express");
const cors = require("cors");
const app = express();

var corsOptions = {
  origin: "http://localhost:8080" || "http://studenteventmanage.tech"
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// simple route

const db = require("./app/models");
db.sequelize.sync({ alter: false });

require("./app/routes/user.routes")(app);
require("./app/routes/superAdmin.routes")(app);
require("./app/routes/admin.routes")(app);
require("./app/routes/location.routes")(app);
require("./app/routes/eventsAt.routes")(app);
require("./app/routes/privateEvent.routes")(app);
require("./app/routes/publicEvent.routes")(app);
require("./app/routes/rsoEvent.routes")(app);
require("./app/routes/rso.routes")(app);
require("./app/routes/comment.routes")(app);
require("./app/routes/join.routes")(app);
require("./app/routes/universitiesCreated.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});