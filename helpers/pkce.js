"use strict";

const base64url = require("base64url");
const crypto = require("crypto");

module.exports = {
  hash: (codeVerifier) => {
    const hash = crypto
      .createHash("sha256")
      .update(codeVerifier)
      .digest();

    return base64url.encode(hash);
  },
};