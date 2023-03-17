const path = require("path");
const config = require(path.join(__dirname, "../config/config.json"))

const env = process.env.NODE_ENV || "development";

module.exports = config[env]
