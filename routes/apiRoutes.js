"use strict";

const models = require("../models");

module.exports = (app) => {
  app.post("/api/client", (request, response) => {
    models.Client
      .findOrCreate({
        clientId: request.body["client_id"],
        clientSecret: request.body["client_secret"],
        name: request.body["name"],
        redirectUri: request.body["redirect_uri"],
      })
      .then((client) => {
        response
          .status(201)
          .json({
            "client_id": client.clientId,
            "name": client.name,
            "redirect_uri": client.redirectUri,
          });
      });
  });
};