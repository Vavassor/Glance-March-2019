"use strict";

module.exports = (app) => {
  app.get("/", (request, response) => {
    response.render("index",
      {
        title: "Glance",
      });
  });

  app.get("/login", (request, response) => {
    response.render("login",
      {
        title: "Log in",
      });
  });

  app.get("*", (request, response) => {
    response.render("page-not-found");
  });
};