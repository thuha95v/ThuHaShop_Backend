const express = require("express");
const cors = require("cors");

const app = express();
const { port: portConfig } = require("./config/config");
const port = portConfig || 3000;

const { userRoute, adminRoute } = require("./routes");
const { errorConverter, errorHandler } = require("./middlewares/error");
app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.disable("x-powered-by");

app.use("/api/admin/v1", adminRoute)
app.use("/api/v1", userRoute);

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
