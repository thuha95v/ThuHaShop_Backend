const db = require("../models");

db.sequelize
  .sync({ alert: true })
  .then(() => {
    console.log("Migrate success...");
  })
  .catch((err) => {
    console.log("Error migrate", err);
  })
  .finally(() => {
    process.exit();
  });
