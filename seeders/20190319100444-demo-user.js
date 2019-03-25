"use strict";

const bcrypt = require("bcrypt-nodejs");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("accounts", [
        {
          "username": "vavassor",
          "password": bcrypt.hashSync("password", bcrypt.genSaltSync(10)),
          "email": "copernicus-@hotmail.com",
          "created_at": new Date(),
          "updated_at": new Date(),
        },
      ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Accounts", null, {});
  },
};