"use strict";

const models = require("../models");
const nanoid = require("nanoid");
const passport = require("passport");
const uuidv5 = require("uuid/v5");

module.exports = (app) => {
  app.post("/api/app", (request, response) => {
    const name = request.body.name;
    let website = request.body.website;
    const redirectUri = request.body["redirect_uri"];

    if (!redirectUri || redirectUri.length === 0 || !name || name.length === 0) {
      response
        .status(400)
        .json({
          reason: "Missing parameter. Please give a `name` and `redirect_uri`.",
        });
    }

    if (!website || website.length === 0) {
      website = null;
    }

    const clientId = uuidv5(name, uuidv5.URL);
    const clientSecret = nanoid();

    models.App
      .findOrCreate({
        defaults: {
          clientId: clientId,
          clientSecret: clientSecret,
          name: name,
          redirectUri: redirectUri,
          website: website,
        },
        where: {
          clientId: clientId,
        },
      })
      .then(([app, created]) => {
        let statusCode = 200;
        if (created) {
          statusCode = 201;
        }
        response
          .status(statusCode)
          .json({
            "client_id": app.clientId,
            "client_secret": clientSecret,
            "name": app.name,
            "redirect_uri": app.redirectUri,
            "website": app.website,
          });
      });
  });

  app.get(
    "/api/account",
    passport.authenticate("bearer", {session: false}),
    (request, response) => {
      models.Account
        .findOne({
          where: {
            id: request.user.id,
          },
        })
        .then((account) => {
          response.json({
            "email": account.email,
          });
        })
        .catch((error) => {
          response.json({error: error});
        });
    });
};