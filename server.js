"use strict";

const express = require("express");
const exphbs = require("express-handlebars");
const passport = require("passport");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 8080;

const db = require("./models");

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    helpers: {
      section: function(name, options) {
        if (!this._sections) {
          this._sections = {};
        }
        this._sections[name] = options.fn(this);
        return null;
      },
    },
  })
);
app.set("view engine", "handlebars");

app.use(session({
  secret: "Super Secret Session Key",
  saveUninitialized: true,
  resave: true,
}));

app.use(passport.initialize());
app.use(passport.session());

require("./routes/apiRoutes")(app);
require("./routes/oauth2Routes")(app);
require("./routes/htmlRoutes")(app);

db.sequelize
  .sync({force: true})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}.`);
    });
  });