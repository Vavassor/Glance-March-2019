"use strict";

const AppStrategy = require("./controllers/app-strategy.js");
const oauth2orize = require("oauth2orize");
const oauth2Controller = require("./controllers/oauth2.js");
const authentication = require("./controllers/authentication.js");
const BearerStrategy = require("passport-http-bearer").Strategy;
const express = require("express");
const exphbs = require("express-handlebars");
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 8080;

const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/config/config.js")[env];

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
  secret: config.session.secret,
  saveUninitialized: true,
  resave: true,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use("app", new AppStrategy(authentication.authenticateApp));
passport.use(new BearerStrategy(authentication.authenticateBearer));
passport.use(new LocalStrategy(authentication.authenticateLocal));
passport.serializeUser(authentication.serializeUser);
passport.deserializeUser(authentication.deserializeUser);

const oauth2Server = oauth2orize.createServer();
oauth2Server.grant(oauth2orize.grant.code(oauth2Controller.grantCode));
oauth2Server.exchange(oauth2orize.exchange.code(oauth2Controller.exchangeCode));
oauth2Server.serializeClient(oauth2Controller.serializeClient);
oauth2Server.deserializeClient(oauth2Controller.deserializeClient);

require("./routes/apiRoutes")(app);
require("./routes/oauth2Routes")(app, oauth2Server);
require("./routes/htmlRoutes")(app);

db.sequelize
  .sync({force: true})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}.`);
    });
  });