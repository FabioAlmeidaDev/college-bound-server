const express = require("express");
const port = process.env.PORT || 3001;

const config = require("./config/CONSTANTS.json");

// Models
require("./models/user");

const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// ROUTES
const requireAuth = require("./middleware/requireAuth");
const signin = require("./routes/Signin");


const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.use(signin);

app.get("/", requireAuth, (req, res) => {
  res.send(`Your email: ${req.user}`);
});

app.get("/time", requireAuth, (req, res) => {
  res.send(`the time is: ${Date.now()}`);
});

const mongoURI = `mongodb+srv://${config.DB.USER}:${config.DB.PASSWORD}@${config.DB.URI}/${config.DB.COLLECTION}?retryWrites=true&w=majority`;
mongoose.connect(mongoURI, { autoIndex: false });

mongoose.connection.on("connected", () => {
  console.info("connected to mogoDB");
});
mongoose.connection.on("error", (e) => {
  console.error("error connecting to mongoDB: ", e);
});
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
