const express = require('express');
const port = process.env.PORT || 8080;
const db = require("./models/index");

//Sync database
db.sequelize.sync();

const Util = require('./util');
const Passport = require('./routes/authentication').passport;

//Initiate express
const app = express();

app.use(require('morgan')('combined')); //HTTP request logger
app.use(require('express-session')({
  secret: 'banana peixinho',
  resave: true,
  saveUninitialized: true 
}));

app.use(function(req, res, next) {
  const origin = req.headers.origin;
  res.header("Access-Control-Allow-Origin", origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(Passport.initialize());
app.use(Passport.session());

//Routes authorization
app.use(function (req, res, next) {
  if (!req.isAuthenticated() && !(Util.isAllowedPath(req.path))) {
    return res.sendStatus(401);
  } else {
    next();
  }
});

app.use(require("./routes"))

app.listen(port);

console.log(`Server started on port - ${port}`);