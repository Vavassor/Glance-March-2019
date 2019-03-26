"use strict";

const authentication = require("../controllers/authentication.js");
const oauth2Controller = require("../controllers/oauth2.js");
const passport = require("passport");

module.exports = (app, oauth2Server) => {
  app.get(
    "/oauth2/authorize",
    authentication.ensureLoggedIn(),
    oauth2Server.authorization(oauth2Controller.authorize),
    (request, response) => {
      response.render("authorize",
        {
          title: "Authorize",
          client: request.oauth2.client,
          user: request.user,
          transactionId: request.oauth2.transactionID,
        }
      );
    }
  );

  app.post(
    "/oauth2/decision",
    authentication.ensureLoggedIn(),
    oauth2Server.decision()
  );

  app.post(
    "/oauth2/token",
    passport.authenticate("app", {session: false}),
    oauth2Server.token(),
    oauth2Server.errorHandler()
  );

  app.post(
    "/login",
    passport.authenticate(
      "local",
      {
        successReturnToOrRedirect: "/",
        failureRedirect: "/login",
      }
    )
  );
};