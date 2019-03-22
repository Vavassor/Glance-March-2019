"use strict";

const authentication = require("./authentication.js");
const models = require("../models");
const nanoid = require("nanoid");
const oauth2orize = require("oauth2orize");
const passport = require("passport");

module.exports = (app) => {
  const server = oauth2orize.createServer();

  server.serializeClient((client, done) => {
    return done(null, client.id);
  });
  
  server.deserializeClient((id, done) => {
    models.App
      .findOne({
        where: {
          clientId: id,
        },
      })
      .then((app) => {
        if (!app) {
          return done(null, false);
        }
        done(null, app);
      })
      .catch((error) => {
        done(error);
      });
  });

  server.grant(oauth2orize.grant.code(
    (client, redirectUri, user, ares, done) => {
      models.AuthorizationCode
        .create({
          value: nanoid(),
          redirectUri: redirectUri,
        })
        .then((code) => {
          done(null, code.value);
        })
        .catch((error) => {
          done(error);
        });
    }
  ));

  server.exchange(oauth2orize.exchange.code(
    (client, code, redirectUri, done) => {
      AuthorizationCode
        .findOne({
          where: {
            value: code,
          },
        })
        .then((authorizationCode) => {
          if (!authorizationCode
              || authorizationCode.redirectUri !== redirectUri) {
            return done(null, false);
          }
          
          models.AccessToken
            .create({
              value: nanoid(),
            })
            .then((token) => {
              done(null, token.value, null, null);
            })
            .catch((error) => {
              done(error);
            });
        })
        .catch((error) => {
          done(error);
        });
    }
  ));

  app.get(
    "/oauth2/authorize",
    authentication.ensureLoggedIn(),
    server.authorization((clientId, redirectUri, done) => {
      models.App
        .findOne({
          where: {
            clientId: clientId,
          },
        })
        .then((app) => {
          if (redirectUri !== app.redirectUri) {
            return done(null, false);
          }
          done(null, app, redirectUri);
        })
        .catch((error) => {
          done(error);
        });
    }),
    (request, response) => {
      response.render("authorize",
        {
          title: "Authorize",
          clientName: request.oauth2.client.name,
          transactionId: request.oauth2.transactionID,
        }
      );
    }
  );

  app.post(
    "/oauth2/decision",
    authentication.ensureLoggedIn(),
    server.decision()
  );

  app.post(
    "/oauth2/token",
    server.token(),
    server.errorHandler()
  );

  app.post(
    "/login",
    passport.authenticate("local", {successReturnToOrRedirect: "/", failureRedirect: "/login"})
  );
};