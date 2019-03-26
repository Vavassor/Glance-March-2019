"use strict";

const models = require("../models");
const passwordHelper = require("../helpers/password.js");

module.exports = {
  authenticateApp: (clientId, clientSecret, codeVerifier, done) => {
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
          passwordHelper.compareHash(clientSecret, app.clientSecret)
            .then((same) => {
              if (!same) {
                return done(null, false);
              }
              done(null, app);
            })
            .catch(error => done(error));
        } else if (codeVerifier) {
          done(null, app);
        } else {
          return done(null, false);
        }
      })
      .catch(error => done(error));
  },

  authenticateBearer: (token, done) => {
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
      .catch(error => done(error));
  },

  authenticateLocal: (username, password, done) => {
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
        passwordHelper.compareHash(password, account.password)
          .then((same) => {
            if (!same) {
              return done(null, false);
            }
            done(null, account);
          })
          .catch(error => done(error));
      })
      .catch(error => done(error));
  },

  deserializeUser: (id, done) => {
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
      .catch(error => done(error));
  },

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

  serializeUser: (user, done) => {
    return done(null, user.id);
  },
};