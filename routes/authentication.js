"use strict";

const AppStrategy = require("./app-strategy.js");
const BearerStrategy = require("passport-http-bearer").Strategy;
const bcrypt = require("bcrypt-nodejs");
const models = require("../models");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

passport.use("app", new AppStrategy(
  (clientId, clientSecret, done) => {
    models.App
      .findOne({
        where: {
          clientId: clientId,
        },
      })
      .then((app) => {
        if (!app || (clientSecret && clientSecret !== app.clientSecret)) {
          return done(null, false);
        }
        done(null, app);
      })
      .catch((error) => {
        done(error);
      });
  }
));

passport.use(new BearerStrategy(
  (token, done) => {
    models.AccessToken
      .findOne({
        where: {
          value: token,
        },
      })
      .then((accessToken) => {
        if (!accessToken) {
          return done(null, false);
        }
        
        return models.Account
          .findOne({
            where: {
              id: accessToken.accountId,
            },
          });
      })
      .then((account) => {
        if (!account) {
          return done(null, false);
        }
        done(null, account);
      })
      .catch((error) => {
        done(error);
      });
  }
));

passport.use(new LocalStrategy(
  (username, password, done) => {
    models.Account
      .findOne({
        where: {
          username: username,
        },
      })
      .then((account) => {
        if (!account) {
          return done(null, false);
        }
        
        bcrypt.compare(password, account.password, (error, same) => {
          if (error) {
            return done(error);
          }
          if (!same) {
            return done(null, false);
          }
          done(null, account);
        });
      })
      .catch((error) => {
        done(error);
      });
  }
));

passport.serializeUser((user, done) => {
  return done(null, user.id);
});

passport.deserializeUser((id, done) => {
  models.Account
    .findOne({
      where: {
        id: id,
      },
    })
    .then((account) => {
      if (!account) {
        return done(null, false);
      }
      done(null, account);
    })
    .catch((error) => {
      done(error);
    });
});

module.exports = {
  ensureLoggedIn: () => {
    return (request, response, next) => {
      if (!request.isAuthenticated || !request.isAuthenticated()) {
        if (request.session) {
          request.session.returnTo = request.originalUrl || request.url;
        }
        return response.redirect("/login");
      }
      next();
    }
  },
};