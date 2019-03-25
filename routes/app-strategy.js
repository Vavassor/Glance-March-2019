"use strict";

const passport = require("passport-strategy");
const util = require("util");

function AppStrategy(options, verify) {
  if (typeof options == "function") {
    verify = options;
    options = {};
  }
  if (!verify) {
    throw new Error("App authentication strategy requires a verify function.");
  }
  
  passport.Strategy.call(this);
  this.name = "app";
  this._verify = verify;
}

util.inherits(AppStrategy, passport.Strategy);

AppStrategy.prototype.authenticate = function(request) {
  if (!request.body || !request.body["client_id"]) {
    return this.fail();
  }
  
  const clientId = request.body["client_id"];
  const clientSecret = request.body["client_secret"];

  const self = this;

  const verified = (error, client, info) => {
    if (error) {
      return self.error(error);
    }
    if (!client) {
      return self.fail();
    }
    self.success(client, info);
  }

  this._verify(clientId, clientSecret, verified);
};

module.exports = AppStrategy;