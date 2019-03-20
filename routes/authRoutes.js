"use strict";

const passport = require("passport");

module.exports = (app) => {
  app.get(
    "/oauth2/authorize",
    server.authorize((clientId, redirectUri, done) => {
      Client.findOne(
        {
          clientId: clientId,
        },
        (error, client) => {
          if (error) {
            done(error);
          } else if (!client) {
            done(null, false);
          } else if (client.redirectUri !== redirectUri) {
            done(null, false);
          } else {
            done(null, client, client.redirectUri);
          }
        });
    }),
    (request, response) => {
      response.render("authorize", {
        transactionId: request.oauth2.transactionID,
        user: request.user,
        client: request.oauth2.client,
      });
    });

  app.post(
    "/oauth2/token",
    passport.authenticate(["basic", "oauth2-client-password"], {session: false}),
    server.token(),
    server.errorHandler());
};