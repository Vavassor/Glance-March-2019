"use strict";

const bcrypt = require("bcrypt-nodejs");

module.exports = {
  compareHash: (password, hash) => {
    return new Promise(
      (resolve, reject) => {
        bcrypt.compare(password, hash, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      }
    );
  },

  hash: (password) => {
    return new Promise(
      (resolve, reject) => {
        bcrypt.genSalt(10, (error, salt) => {
          if (error) {
            reject(error);
          }
          bcrypt.hash(password, salt, null, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        });
      }
    );
  },
};