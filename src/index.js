require('./models/user');
require('./models/Athlete');
require('./models/Covid');
require('./models/Questions');

const port = process.env.PORT || 3001;
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const athleteRoutes = require('./routes/athletes');
const covidRoutes = require('./routes/covidRoutes');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const requireAuth = require('./middleware/requireAuth');

const app = express();

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyParser.json());
app.use(authRoutes);
app.use(athleteRoutes);
app.use(covidRoutes);

app.get('/', requireAuth, (req, res) => {
  res.send(`Your email: ${req.user}`);
});

const mongoURI = 'mongodb+srv://admin:Cinza5713@cluster0-xsb7s.mongodb.net/covid-waiver?retryWrites=true&w=majority';
mongoose.connect(mongoURI, { useNewUrlParser: true, useCreateIndex: true });

mongoose.connection.on('connected', () => {
  console.info('connecte to mogoDB');
});
mongoose.connection.on('error', (e) => {
  console.error('error connecting to mongoDB: ', e);
});
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
