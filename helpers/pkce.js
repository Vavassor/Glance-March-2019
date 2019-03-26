"use strict";

const crypto = require("crypto");

function toBase64Url(base64) {
  for (let i = 0; i < base64.length; i++) {
    switch (base64[i]) {
      case "+":
        base64[i] = "-";
        break;

      case "/":
        base64[i] = "_";
        break;
    }
  }
}

module.exports = {
  hash: (codeVerifier) => {
    const hash = crypto
      .createHash("sha256")
      .update(codeVerifier)
      .digest("base64");

    return toBase64Url(hash);
  },
};