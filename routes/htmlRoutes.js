"use strict";

module.exports = (app) => {
  app.get("/", (request, response) => {
    response.render("index",
      {
        title: "Glance",
      });
  });

  app.get("*", (request, response) => {
    response.render("page-not-found");
  });
};