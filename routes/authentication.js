"use strict";

const AppStrategy = require("./app-strategy.js");
const BearerStrategy = require("passport-http-bearer").Strategy;
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
        if (!app) {
          return done(null, false);
        }
        if (clientSecret) {
          // The secret isn't required. But, if one is provided and it's wrong:
          // it's suspicious.
          app.secretMatches(clientSecret)
            .then((same) => {
              if (!same) {
                return done(null, false);
              }
              done(null, app);
            })
            .catch(error => done(error));
        } else {
          done(null, app);
        }
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
        account.passwordMatches(password)
          .then((same) => {
            if (!same) {
              return done(null, false);
            }
            done(null, account);
          })
          .catch(error => done(error));
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